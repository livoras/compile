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
Pairs' -> Pairs | e
Pairs -> KeyValue PairsTail
PairsTail -> ',' KeyValue PairsTail| e

KeyValue -> Key ':' Value
Key -> id|string
Value -> Obj|Arr|id|string

Arr -> '[' Items' ']'
Items' -> Items|e
Items -> Value ItemsTail
ItemsTail -> ',' Value ItemsTail|e
```
