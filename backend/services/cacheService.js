// services/cacheService.js
const NodeCache = require('node-cache');

class CacheService {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: 600, // 10 minutes default TTL
      checkperiod: 120, // Check for expired keys every 2 minutes
      useClones: false
    });
    
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0
    };
  }

  get(key) {
    const value = this.cache.get(key);
    
    if (value !== undefined) {
      this.stats.hits++;
      console.log(`✅ Cache HIT for key: ${key}`);
      return value;
    }
    
    this.stats.misses++;
    console.log(`❌ Cache MISS for key: ${key}`);
    return null;
  }

  set(key, value, ttl = null) {
    try {
      const success = ttl 
        ? this.cache.set(key, value, ttl)
        : this.cache.set(key, value);
      
      if (success) {
        this.stats.sets++;
        console.log(`💾 Cached key: ${key} ${ttl ? `(TTL: ${ttl}s)` : ''}`);
      }
      
      return success;
    } catch (error) {
      console.error('Error setting cache:', error);
      return false;
    }
  }

  del(key) {
    const deleted = this.cache.del(key);
    console.log(`🗑️ Deleted cache key: ${key}`);
    return deleted;
  }

  flush() {
    this.cache.flushAll();
    console.log('🧹 Cache flushed');
  }

  has(key) {
    return this.cache.has(key);
  }

  getStats() {
    const cacheStats = this.cache.getStats();
    return {
      ...this.stats,
      keys: cacheStats.keys,
      ksize: cacheStats.ksize,
      vsize: cacheStats.vsize,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
    };
  }

  getKeys() {
    return this.cache.keys();
  }

  getTTL(key) {
    return this.cache.getTtl(key);
  }

  mget(keys) {
    return this.cache.mget(keys);
  }

  mset(keyValueArray) {
    return this.cache.mset(keyValueArray);
  }
}

module.exports = new CacheService();