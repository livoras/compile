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
   
Pairs' -> Pairs | e
    first = id, string
    follow = '}'
    
Pairs -> KeyValue PairsTail
    first = id, string
    
PairsTail -> ',' KeyValue PairsTail| e
    first = ','
    follow = '}'
    
KeyValue -> Key ':' Value
    first = id, string
    
Key -> id|string

Value -> Obj|Arr|id|string
    first = '{', '[', id, string

Arr -> '[' Items' ']'
    first = '['
    
Items' -> Items|e
    first = '{', '[', id, string
    follow = ']'
    
Items -> Value ItemsTail
    first = '{', '[', id, string
    
ItemsTail -> ',' Value ItemsTail|e
    first = ','
    follow = ']'
```

Tokens
```
TK_LEFT_BRACE : '{'
TK_RIGHT_BRACE : '}'
TK_ID : ^[\w_][\w\d_]?
TK_STRING : \"[\S\s]?+\"
TK_LEFT_BRACKET : '['
TK_RIGHT_BRACKET : ']'
TK_COMMA : ','
TK_COLON : ':'
TK_EOF : $

```
