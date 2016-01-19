EBNF:

```
S -> Obj|Arr
Obj -> '{' [Pairs] '}'
Pairs -> KeyValue {',' KeyValue}
KeyValue -> Key ':' Value
Key -> id|string
Value -> Obj|Arr|id|string
Arr -> '[' [Items] ']'
Items -> Value {',' Value}
```

* * *

First and Follow:

```
S -> Obj|Arr

Obj -> '{' Pairs' '}'
    first = '{'
    follow = $, ',', '}'
   
Pairs' -> Pairs | e
    first = id, string
    follow = '}'
    
Pairs -> KeyValue PairsTail
    first = id, string
    follow = '}'
    
PairsTail -> ',' KeyValue PairsTail| e
    first = ','
    follow = '}'
    
KeyValue -> Key ':' Value
    first = id, string
    follow = ',', '}'
    
Key -> id|string

Value -> Obj|Arr|id|string
    first = '{', '[', id, string
    follow = ',', '}'

Arr -> '[' Items' ']'
    first = '['
    follow = $, ',', '}'
    
Items' -> Items|e
Items -> Value ItemsTail
ItemsTail -> ',' Value ItemsTail|e
```
