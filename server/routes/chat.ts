import { Router } from 'express';
import { getDb } from '../db/index.js';
import { chats, messages, apps } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { streamChatResponse } from '../services/aiService.js';
import { processAppChanges } from '../services/buildService.js';

const router = Router();

// Get chat messages
router.get('/:id/messages', async (req, res) => {
  try {
    const db = getDb();
    const chatId = parseInt(req.params.id);
    
    const chatMessages = await db.select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.createdAt);
    
    res.json({ messages: chatMessages });
  } catch (error) {
    console.error('Error getting chat messages:', error);
    res.status(500).json({ error: 'Failed to get chat messages' });
  }
});

// Send message to chat
router.post('/:id/messages', async (req, res) => {
  try {
    const db = getDb();
    const chatId = parseInt(req.params.id);
    const { content, attachments = [] } = req.body;
    
    if (!content?.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }
    
    // Save user message
    const [userMessage] = await db.insert(messages).values({
      chatId,
      role: 'user',
      content: content.trim()
    }).returning();
    
    // Get app context
    const [chat] = await db.select({
      appId: chats.appId,
      appName: apps.name,
      appFiles: apps.files
    })
    .from(chats)
    .innerJoin(apps, eq(chats.appId, apps.id))
    .where(eq(chats.id, chatId));
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    // Stream AI response
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');
    
    let fullResponse = '';
    let assistantMessageId: number | null = null;
    
    // Save assistant message placeholder
    const [assistantMessage] = await db.insert(messages).values({
      chatId,
      role: 'assistant',
      content: ''
    }).returning();
    
    assistantMessageId = assistantMessage.id;
    
    try {
      await streamChatResponse({
        message: content.trim(),
        appContext: {
          appId: chat.appId,
          appName: chat.appName,
          files: chat.appFiles
        },
        onChunk: async (chunk: string) => {
          fullResponse += chunk;
          res.write(chunk);
        },
        onComplete: async (finalResponse: string) => {
          // Update assistant message with full response
          await db.update(messages)
            .set({ content: finalResponse })
            .where(eq(messages.id, assistantMessageId!));
          
          // Process app changes if any
          await processAppChanges(chat.appId, finalResponse);
          
          res.end();
        },
        onError: async (error: Error) => {
          console.error('Chat streaming error:', error);
          await db.update(messages)
            .set({ content: `Error: ${error.message}` })
            .where(eq(messages.id, assistantMessageId!));
          
          res.write(`\n\nError: ${error.message}`);
          res.end();
        }
      });
    } catch (error) {
      console.error('Error in chat streaming:', error);
      await db.update(messages)
        .set({ content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` })
        .where(eq(messages.id, assistantMessageId!));
      
      res.write(`\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.end();
    }
    
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get chat by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const chatId = parseInt(req.params.id);
    
    const [chat] = await db.select()
      .from(chats)
      .where(eq(chats.id, chatId));
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    res.json(chat);
  } catch (error) {
    console.error('Error getting chat:', error);
    res.status(500).json({ error: 'Failed to get chat' });
  }
});

// List chats for an app
router.get('/app/:appId', async (req, res) => {
  try {
    const db = getDb();
    const appId = parseInt(req.params.appId);
    
    const appChats = await db.select()
      .from(chats)
      .where(eq(chats.appId, appId))
      .orderBy(desc(chats.updatedAt));
    
    res.json({ chats: appChats });
  } catch (error) {
    console.error('Error listing chats:', error);
    res.status(500).json({ error: 'Failed to list chats' });
  }
});

export { router as chatRoutes };
