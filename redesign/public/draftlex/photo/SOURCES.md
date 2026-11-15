> This copy holds the set without faces: counsel.jpg is the stairs photograph and blazer.jpg the pile of papers (see below).

# Photographs in the Draftlex case

All seven come from Unsplash, listed there under the free Unsplash licence, and were fetched on 14 November 2026
at 1600 px wide. The author is given as the Unsplash account that published the photograph.
Whether these may go on the studio's site is for Maksym to decide; nothing here has been published.

| File | Shows | Recognisable person | Author (Unsplash account) | Page |
|---|---|---|---|---|
| `photo/columns.jpg` | classical columns of a facade | no | @sschusterphotoart | https://unsplash.com/photos/architectural-facade-featuring-classical-columns-and-strong-shadows-lCkHnqTnjXw |
| `photo/stairs.jpg` | stone staircase with columns | no | @httnhan | https://unsplash.com/photos/stone-staircase-with-classical-columns-_NChq9Wlyds |
| `photo/sign.jpg` | a hand writing on paper | no (hands only) | @amstram | https://unsplash.com/photos/man-writing-on-paper-OQMZwNd3ThU |
| `photo/sign-b.jpg` | a hand writing on paper (not used on any slide now) | no (hands only) | @cytonn_photography | https://unsplash.com/photos/person-writing-on-white-paper-GJao3ZTX9gU |
| `photo/papers.jpg` | a pile of papers | no | @sharonmccutcheon | https://unsplash.com/photos/pile-of-printing-papers-tn57JI3CewI |
| `photo/counsel.jpg` | a man in a dark suit | **yes** | @alimorshedlou | https://unsplash.com/photos/man-wearing-black-notched-lapel-suit-jacket-in-focus-photography-WMD64tMfc4k |
| `photo/blazer.jpg` | a woman in a suit and sunglasses | **yes** | @mdesign85 | https://unsplash.com/photos/a-woman-in-a-suit-and-sunglasses-posing-for-a-picture-hYLXO9FBIc4 |

## Where the two portraits are used

- `counsel.jpg`: slide 1.1 (one of the eight grounds), 1.5 and 1.11 (inside the ring), the hero of the website (2.1, 2.4, 2.5).
- `blazer.jpg`: slide 1.8 (the photograph among the stationery).

## The version without faces

`node faces.mjs off` replaces both portraits (stairs instead of the man, the pile of papers instead of the woman);
`node faces.mjs on` puts them back. The originals are kept in `photo/with-faces/`, the replacements in
`photo/no-faces/`. After switching, run `node shots.mjs` again.
