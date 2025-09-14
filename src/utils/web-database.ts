// Web-compatible database utilities

export interface WebDatabase {
  query: {
    apps: {
      findFirst: (options: any) => Promise<any>;
      findMany: (options?: any) => Promise<any[]>;
    };
    chats: {
      findFirst: (options: any) => Promise<any>;
      findMany: (options?: any) => Promise<any[]>;
    };
    messages: {
      findFirst: (options: any) => Promise<any>;
      findMany: (options?: any) => Promise<any[]>;
    };
  };
  insert: (table: any) => any;
  update: (table: any) => any;
  delete: (table: any) => any;
}

// Mock database for web version using localStorage
class WebDatabaseImpl implements WebDatabase {
  private storage: Storage;

  constructor() {
    this.storage = typeof window !== 'undefined' ? window.localStorage : new Map() as any;
  }

  private getTableData(tableName: string): any[] {
    const data = this.storage.getItem(`db_${tableName}`);
    return data ? JSON.parse(data) : [];
  }

  private setTableData(tableName: string, data: any[]): void {
    this.storage.setItem(`db_${tableName}`, JSON.stringify(data));
  }

  query = {
    apps: {
      findFirst: async (options: any) => {
        const apps = this.getTableData('apps');
        if (options.where && options.where.id) {
          return apps.find(app => app.id === options.where.id) || null;
        }
        return apps[0] || null;
      },
      findMany: async (options?: any) => {
        return this.getTableData('apps');
      }
    },
    chats: {
      findFirst: async (options: any) => {
        const chats = this.getTableData('chats');
        if (options.where && options.where.id) {
          return chats.find(chat => chat.id === options.where.id) || null;
        }
        return chats[0] || null;
      },
      findMany: async (options?: any) => {
        return this.getTableData('chats');
      }
    },
    messages: {
      findFirst: async (options: any) => {
        const messages = this.getTableData('messages');
        if (options.where && options.where.id) {
          return messages.find(message => message.id === options.where.id) || null;
        }
        return messages[0] || null;
      },
      findMany: async (options?: any) => {
        return this.getTableData('messages');
      }
    }
  };

  insert = (table: any) => ({
    values: (data: any) => {
      const tableName = table._.name;
      const existingData = this.getTableData(tableName);
      const newData = Array.isArray(data) ? data : [data];
      newData.forEach(item => {
        item.id = existingData.length + 1;
        item.createdAt = new Date().toISOString();
        item.updatedAt = new Date().toISOString();
        existingData.push(item);
      });
      this.setTableData(tableName, existingData);
      return { returning: () => newData };
    }
  });

  update = (table: any) => ({
    set: (data: any) => ({
      where: (condition: any) => {
        const tableName = table._.name;
        const existingData = this.getTableData(tableName);
        const updatedData = existingData.map((item: any) => {
          if (condition.id && item.id === condition.id) {
            return { ...item, ...data, updatedAt: new Date().toISOString() };
          }
          return item;
        });
        this.setTableData(tableName, updatedData);
        return { returning: () => updatedData.filter((item: any) => 
          condition.id && item.id === condition.id
        ) };
      }
    })
  });

  delete = (table: any) => ({
    where: (condition: any) => {
      const tableName = table._.name;
      const existingData = this.getTableData(tableName);
      const filteredData = existingData.filter((item: any) => {
        if (condition.id && item.id === condition.id) {
          return false;
        }
        return true;
      });
      this.setTableData(tableName, filteredData);
      return { returning: () => [] };
    }
  });
}

let _db: WebDatabase | null = null;

export function initializeWebDatabase(): WebDatabase {
  if (!_db) {
    _db = new WebDatabaseImpl();
  }
  return _db;
}

export function getWebDb(): WebDatabase {
  if (!_db) {
    throw new Error('Database not initialized. Call initializeWebDatabase() first.');
  }
  return _db;
}
