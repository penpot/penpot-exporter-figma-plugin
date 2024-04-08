# Developer guide

The plugin relies in
[penpot.js](https://github.com/penpot/penpot-exporter-figma-plugin/blob/main/src/penpot.js) library.
It contains a subset of Penpot frontend app, transpiled into javascript to be used from js code
(this was easy since the frontend is written in ClojureScript, that has direct translation to
javascript).

Basically, it exports the `createFile` function and the `File` data type, that represents a Penpot
file as it resides in memory inside the frontend app. It has function to create pages and their
content, and also an `export` function that generates and downloads a .zip archive with the Penpot
file as svg documents in Penpot annotated format, that you can import directly into Penpot.

You can see the
[source of the library at Penpot repo](https://github.com/penpot/penpot/tree/develop/frontend/src/app/libs).

To see a general description of the data types used in the functions you can see
[the data model](https://help.penpot.app/technical-guide/data-model/). Their full specifications are
in the
[common types module](https://github.com/penpot/penpot/tree/develop/common/src/app/common/types).

Those types are defined in [Clojure spec](https://clojure.org/guides/spec) format. For those
unfamiliar with the syntax, here is a small basic guide:

```clojure
(s/def ::name string?)
(s/def ::id uuid?)
```

A parameter or attribute called `name` is of type string, and `id` is an _uuid_ string (e.g.
"000498f3-27fc-8000-8988-ca7d52f46843").

```clojure
(s/def ::stroke-alignment #{:center :inner :outer})
```

`stroke-alignment` is of an enumerated type, and the valid values are "center", "inner" and "outer".

```clojure
(ns app.common.types.shape
  (:require
   [app.common.spec :as us]
   ...))

(s/def ::line-height ::us/safe-number)
```

`line-height` is of the type `safe-number`, defined in `app.common.spec` namespace, that here is
imported with the name `us` (a _safe number_ is a integer or floating point number, with a value not
too big or small).

```clojure
(s/def ::page
  (s/keys :req-un [::id ::name ::objects ::options]))
```

`page` is an object with four required arguments: `id`, `name`, `objects` and `options`, whose types
have to be defined above.

```clojure
(s/def ::column
  (s/keys :req-un [::color]
          :opt-un [::size
                   ::type
                   ::item-length
                   ::margin
                   ::gutter]))
```

`column` has one required attribute `color` and five optional ones `size`, `type`, `item-length`,
`margin` and `gutter`.

```clojure
(s/def ::children
  (s/coll-of ::content
             :kind vector?
             :min-count 1))
```

`children` is a collection (implemented as a vector) of objects of type `content`, and must have a
minimun lenght of 1.

```clojure
(defmulti animation-spec :animation-type)

(defmethod animation-spec :dissolve [_]
  (s/keys :req-un [::duration
                   ::easing]))

(defmethod animation-spec :slide [_]
  (s/keys :req-un [::duration
                   ::easing
                   ::way
                   ::direction
                   ::offset-effect]))

(defmethod animation-spec :push [_]
  (s/keys :req-un [::duration
                   ::easing
                   ::direction]))

(s/def ::animation
  (s/multi-spec animation-spec ::animation-type))
```

This is probably the most complex construct. `animation` is a multi schema object. It has an
attribute called `animation-type` and the rest of the fields depend on its value. For example, if
`animation-type` is "dissolve", the object must also have a `duration` and an `easing` attribute.

Other constructs should be more or less auto explicative with this guide and the clojure.spec manual
linked above.
