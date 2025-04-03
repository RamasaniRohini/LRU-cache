class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map();

        this.head = new Node(-1, -1);
        this.tail = new Node(-1, -1);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    get(key) {
        if (this.map.has(key)) {
            let node = this.map.get(key);
            this._remove(node);
            this._insert(node);
            this._updateUI(`Key ${key} found with value: ${node.value}`);
            return node.value;
        } else {
            this._updateUI(`Key ${key} not found`);
            return -1;
        }
    }

    put(key, value) {
        if (this.map.has(key)) {
            this._remove(this.map.get(key));
        }
        if (this.map.size === this.capacity) {
            this._remove(this.tail.prev, true);
        }
        this._insert(new Node(key, value));
        this._updateUI(`Key ${key} inserted/updated`);
    }

    _insert(node) {
        this.map.set(node.key, node);
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }

    _remove(node, isEvicted = false) {
        this.map.delete(node.key);
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    _updateUI(message) {
        document.getElementById("message").textContent = message;

        let cacheContainer = document.getElementById("cacheContainer");
        cacheContainer.innerHTML = "";

        let temp = this.head.next;
        while (temp !== this.tail) {
            let div = document.createElement("div");
            div.className = "cache-item";
            div.textContent = `(${temp.key}, ${temp.value})`;
            cacheContainer.appendChild(div);
            temp = temp.next;
        }

        let lruNode = this.tail.prev !== this.head ? this.tail.prev : null;
        let mruNode = this.head.next !== this.tail ? this.head.next : null;
        document.getElementById("lru").textContent = lruNode ? `(${lruNode.key}, ${lruNode.value})` : "-";
        document.getElementById("mru").textContent = mruNode ? `(${mruNode.key}, ${mruNode.value})` : "-";
    }
}

let cache = null;

function initializeCache() {
    let size = parseInt(document.getElementById("cacheSize").value);
    cache = new LRUCache(size);
    document.getElementById("cacheContainer").innerHTML = "";
    document.getElementById("message").textContent = `LRU Cache initialized with size ${size}`;
}

function put() {
    let key = parseInt(document.getElementById("keyInput").value);
    let value = parseInt(document.getElementById("valueInput").value);
    cache.put(key, value);
}

function get() {
    let key = parseInt(document.getElementById("keyInput").value);
    cache.get(key);
}