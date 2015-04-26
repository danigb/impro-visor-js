* Equivalences and substitutions
 *
Eventually this information should be in the .voc file, but this will require
some recoding.
 *
Chord equivalences and substitutions are read in here for the purposes of
parsing chord bricks with substituted chords. These are divided into 
equivalence rules and substitution rules.
 *
Equivalence rules describe a set of chords which are all interchangeable for
each other in a given piece. They have the form
 *
    (equiv [list of equivalent chords])
 *
and are expected to contain two or more chords in order to constitute a 
valid rule.

Substitution rules are the unidirectional version of equivalence rules, 
describing when a set of chords could all replace a given chord in a piece
but could not be always replaced by that chord. They have the form
 *
    (sub [original chord] [list of possible substitutions])
 *
and must also contain at least one chord besides the original chord in order
to be valid.
 *
 