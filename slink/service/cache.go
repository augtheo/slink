package service

import (
	"container/list"
	"errors"
)

type LRUCache struct {
	capacity int
	cache    map[string]*list.Element
	list     *list.List
}

type Node struct {
	urlId       int
	expandedUrl string
}

type pair struct {
	key string
	val Node
}

func CreateLRUCache(capacity int) *LRUCache {
	if capacity <= 0 {
		panic("Capacity should be greater than 0")
	}
	return &LRUCache{
		capacity: capacity,
		cache:    make(map[string]*list.Element),
		list:     list.New(),
	}
}

func (l *LRUCache) Get(key string) (Node, error) {
	if elem, found := l.cache[key]; found {
		l.list.MoveToFront(elem)
		return elem.Value.(pair).val, nil
	}
	var zero Node
	return zero, errors.New("Key does not exist")
}

func (l *LRUCache) Put(key string, val Node) {
	if elem, found := l.cache[key]; found {
		l.list.Remove(elem)
	}
	l.cache[key] = l.list.PushFront(pair{key: key, val: val})
	if l.list.Len() > l.capacity {
		delete(l.cache, l.list.Back().Value.(pair).key)
		l.list.Remove(l.list.Back())
	}
}
