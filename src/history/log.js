function DoublyLinkedList() {
    var Node = function (element) {
        this.element = element;
        this.prev = null;
        this.next = null;
    };

    var length = 0,
        head = null;
    //向尾部追加
    this.append = function (element) {
        var node = new Node(element),
            current,
            previous;

        if (!head) {
            head = node;
        } else {
            current = head;
            while (current) {
                previous = current;
                current = current.next;
            }
            previous.next = node
            node.prev = previous
        }
        length++;
        return true;
    }
    //指定位置插入
    this.insert = function (position, element) {
        if (position > -1 && position <= length) {
            var node = new Node(element),
                current = head,
                previous,
                index = 0;
            if (position === 0) {
                if (!head) {
                    head = node;
                } else {
                    node.next = head;
                    head.prev = node;
                    head = node;
                }
            } else {
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
                if (position != length) {
                    node.next = current;
                    current.prev = node;
                }
                previous.next = node;
                node.prev = previous;
            }
            length++;
            return true;
        } else {
            return false;
        }
    };
    //删除指定位置元素
    this.removeAt = function (position) {
        if (position > -1 && position < length) {
            var current = head,
                index = 0,
                previous;
            if (position === 0) {
                head = head.next;
                head.prev = null;
            } else {
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }

                if (position === length - 1) {
                    previous.next = null;
                } else {
                    previous.next = current.next;
                    current.next.prev = previous;
                }
            };
            length--;
            return current.element;
        } else {
            return false;
        }
    };
    //删除值为element的所有元素
    this.removeEle = function (element) {
        var current = head,
            previous,
            num = 0;
        if (current.element === element) {
            head = current.next;
        }
        previous = current;
        current = current.next;

        while (current) {
            if (current.element == element) {
                previous.next = current.next;
                if (current.next) {
                    current.next.prev = previous;
                }
                current = current.next;
                length--;
                num++;
            } else {
                previous = current;
                current = current.next;
            }

        }
        return num;
    };
    //删除尾部
    this.remove = function () {
        if (length === 0) {
            return false;
        };

        var current = head,
            previous;

        if (length === 1) {
            head = null;
            length--;
            return current.element;
        }

        while (current.next) {
            previous = current;
            current = current.next;
        }

        previous.next = null;
        length--;
        return current.element;
    };
    this.removeAll = function (from = 0) {
        while (from >= 0 && length > from) {
            this.remove()
        };
        return true
    }
    //当前元素的其实位置
    this.indexOf = function (element) {
        var current = head,
            index = 0;

        while (current && index < length) {
            if (current.element === element) {
                return index;
            };
            current = current.next;
            index++;
        }

        return false;
    };
    this.prev = function (element) {
        if(!element){
            return
        }
        var current = head,
            index = 0;
        if (head && element === head.element) {
            return head.element;
        }
        while (current && index < length) {

            if (current.next.element === element) {
                return current.element;
            };
            current = current.next;
            index++;
        }
        return false;
    };
    this.next = function (element) {
        if(!element){
            return
        }
        var current = head,
            index = 0;

        while (current && index < length) {
            if (current.element === element) {
                return (current.next || current).element;
            };
            current = current.next;
            index++;
        }
        return false;
    };
    //是否为空
    this.isEmpty = function () {
        return length === 0;
    };
    //链表长度
    this.size = function () {
        return length;
    };
    //转成字符串
    // this.toString = function () {
    //     var current = head,
    //         string = '';

    //     while (current) {
    //         string += '->'+current.element.value;
    //         current = current.next;
    //     }
    //     return string;
    // };
    //获取头结点元素
    this.getHead = function () {
        return head.element;
    };
    //获取未结点元素
    this.getTail = function () {
        var previous, current = head;
        while (current) {
            previous = current;
            current = current.next;
        }
        return previous.element;
    };
}
class Log {
    max = 10
    storage = []
    keyIdx = {};
    size = 0;
    linkList;
    currentItem = null;
    constructor() {
        this.linkList = new DoublyLinkedList();
    }
}
// Log.prototype.toString = function () {
//    console.log('storage: ',this.storage)
//    console.log('keyIdx: ',this.keyIdx)
//    console.log('currentItem: ',this.currentItem)
//    console.log('linkList: ',this.linkList.toString())
// }
Log.prototype.init = function (max = 10) {
    this.storage.length = 0;
    this.keyIdx = {};
    this.size = 0;
    this.max = Math.max(max, 1);
    this.linkList.removeAll();
}
Log.prototype.remove = function (key, callback) {
    if (this.keyIdx[key] !== undefined) {
        let oldIdx = this.keyIdx[key];
        let item = this.storage[oldIdx];
        callback && callback(item);
        this.linkList.removeEle(item);
        this.storage.splice(oldIdx, 1);
        delete this.keyIdx[key];
        for (let k in this.keyIdx) {
            if (this.keyIdx[k] > oldIdx) {
                this.keyIdx[k]--;
            }
        }
        this.size = this.storage.length
        if (this.currentItem === item) {
            this.currentItem = this.storage[Math.min(oldIdx, this.size - 1)];
        }
        return item;
    }
}
Log.prototype.update = function (key, value) {
    if (this.keyIdx[key] !== undefined) {
        let oldIdx = this.keyIdx[key];
        let item = this.storage[oldIdx];
        item.value = value;
        this.storage.splice(oldIdx, 1);
        this.storage.push(item);
        for (let k in this.keyIdx) {
            if (this.keyIdx[k] > oldIdx) {
                this.keyIdx[k]--;
            }
        }
        this.currentItem = item;
        this.keyIdx[key] = this.storage.length - 1;
        return item
    } else {
        return this.push(key, value)
    }
}
Log.prototype.search = function (key) {
    this.currentItem = this.storage[this.keyIdx[key]];
    return this.currentItem
}
Log.prototype.push = function (key, value) {
    if (this.keyIdx[key] === undefined) {
        let item = {
            key,
            value
        }
        this.linkList.append(item)
        this.storage.push(item);
        if (this.storage.length > this.max) {
            let first = this.first()
            this.remove(first.key)
        }
        this.size = this.storage.length;
        this.keyIdx[key] = this.storage.length - 1;
        this.currentItem = item;
        return item
    } else {
        return this.update(key, value)
    }
}
Log.prototype.prev = function (key) {
    this.search(key)
    return this.linkList.prev(this.currentItem)
}
Log.prototype.next = function (key) {
    this.search(key)
    return this.linkList.next(this.currentItem)
}
Log.prototype.last = function () {
    return this.storage[this.storage.length - 1];
}
Log.prototype.first = function () {
    return this.storage[0];
}


export default Log;