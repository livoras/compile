EBNF:

```
S -> Obj|Arr
Obj -> '{' [Pairs] '}'
Pairs -> KeyValue {',' KeyValue}
KeyValue -> id ':' Value
Value -> Obj|Arr|id
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

KeyValue -> id ':' Value
Value -> Obj|Arr|id

Arr -> '[' Items' ']'
Items' -> Items|e
Items -> Value ItemsTail
ItemsTail -> ',' Value ItemsTail|e
```
