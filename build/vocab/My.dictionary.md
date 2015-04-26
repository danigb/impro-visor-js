
File: My.dictionary, version 1.4, Sat. Dec. 3, 2011
This dictionary text file accompanies the Impro-Visor Application.

Copyright (C) 2011 Robert Keller and Harvey Mudd College

Impro-Visor is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

Impro-Visor is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
merchantability or fitness for a particular purpose.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Impro-Visor; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 

This dictionary was compiled by Zack Merritt, Xanda Schofield, and
Robert Keller, June-Sept. 2011. It is expected that it will undergo many
revisions. In particular, there are probably lots of redundancies that
can be removed.

The terminology in this dictionary is largely based on the definitions in 
John Elliott's book"Insights in Jazz", 2009, published in the UK by Jazzwise 
Publications, and on Conrad Cork's book "The New Guide to Harmony with Lego 
Bricks", published in the UK by Tadley Ewing Publications, 1996. We do not  
claim completeagreement with those works, only that they will be a useful 
guide to understanding the bricks defined herein. 
Also, any mistakes are ours and not those of the above authors.

Note that you do not have to use this dictionary. You can make your own.
 
 Diatonic Checking Information
In order to determine whether a chord is diatonic to a key, the analysis 
requires knowledge of two things: one, the equivalences between possible chord
qualities (such as M7 and M9) and two, the base chords which are diatonic to
the key of C for a given mode.

Equivalence rules have the format
    (equiv [basic chord] [equivalent chord] [equivalent chord] ...)
where the basic chord is one that might arise in the actual diatonic mapping of
a key below, and the equivalent chords are chords of the same root with 
different qualities.

Diatonic rules have the format
    (diatonic [mode] [list of all chords fitting the key of Cmode] )
with the mode generally being capitalized for formatting purposes in the 
leadsheet and roadmap modes.
 
 Brick Definitions
A chord brick can be comprised of anything from a single chord to a series of
complex bricks. 

Each brick is defined by five things: its name (with any qualifier information 
needed), its mode, its type, its key, and the list of subblocks composing it. 
A brick definition thus has the following format:

    (defbrick [name-spaced-by-hyphens]([qualifier]) [mode] [type] [key]
            ([first subblock])
            ([second subblock])
            ...
            ([last subblock]))

 Name: Each brick must have a name by which it can be identified in the 
       brick library. If a name has multiple words, then one may replace the
       spaces in the name with hyphens so as to keep the name in one unit.
       Additionally, if a user wishes to have multiple different brick 
       definitions for the same brick, she may add a qualifier to the name
       of each brick in parentheses directly after the name. Two bricks may
       have the same name, and will be treated as the same brick in parsing,
       but no two may have the same name-qualifier pair. The first definition
       of a brick with a given name will be taken as the default.

 Mode: A brick generally has a single mode which describes the chord sequence
       it contains. Generally, this will either be "Major" or "Minor", based
       upon whether the brick has a "straight" or a "sad" feel or what the
       mode is of the "on" chords of the brick.

 Type: A brick has a type based upon the purpose it serves; for instance, a 
       Cadence introduces a resolving musical idea. A given brick type must
       be listed at the top of the file in order to be treated as a valid
       type in the roadmap. Brick-type definitions are formatted as:

           (brick-type [type name]  [cost])

       where cost specifies how much it is favored in parsing. The larger the
       cost number, the less preferred a brick is as explanation for a series
       of chords when a piece is analyzed.

       A special type, Invisible, accounts for bricks which will not be shown
       to the user in parsing but might help generalize pieces of complex
       bricks with many variations. If a brick is specified as "Invisible", 
       it will not be shown to the user at all in Impro-Visor, but any brick
       definition depending on the brick will still be able to function as
       it normally would.

 Key:  The predominant key of the brick should be based upon where the brick
       does resolve, or in the case of an unresolved sequence where it would
       resolve after the sequence. Usually, the key specified in this library
       is C; however, this is not a prerequisite for a definition.

 Sub-blocks: A "block" is either a brick or a chord; so, a "sub-block" is a 
       brick or chord that acts as part of a definition. These are listed 
       after the basic brick information in order of occurrence in the brick. 
       If a sub-block is a chord, then it is written as
           
           (chord [chord name] [relative duration])

       whereas a brick sub-block would be listed as

           (brick [brick name] [key] [relative duration])
       
       to appropriately describe the default version of that brick. If a sub-
       brick is supposed to be by default a variation on a given brick's
       definition rather than the original, then the quality can be specified
       in the definition as
           
           (brick [brick name]([qualifier]) [key] [relative duration])

       to make the default in the dictionary appear with that variation as a
       sub-block. However, when parsing, the parser will treat all bricks 
       with the same name as substitutable for that brick, so this usage will
       not allow a brick to have a more specific definition in all cases.

       Relative durations describe the ratio of the durations of each sub-
       block to the others in a given brick. These relative durations should
       have values no less than the number of chords composing a given sub-
       block. These are used only for the specification of bricks in the user
       library, as analysis ignores chord durations.

With this information, a brick will be defined in the BrickLibrary and used in
analysis as a possible parse for a given brick. Bricks may be added either by
hand in this file or, more easily, by generating the brick in Impro-Visor's 
Roadmap mode, selecting it, and clicking the "New Brick" button. The definition
will then be added to the bottom of this file to be loaded in future Impro-Visor
use.

If you introduce a Cadence into the brick dictionary, you will notice that 
matching Overrun and Dropback versions of the brick will also appear for that
brick on runtime. At the present, the only way to remove those bricks is to
remove the original cadence.

WARNING: Deleting a brick from the brick dictionary manually may destroy the
definitions of any bricks using the brick you wish to delete as a sub-block. In 
order to avoid damaging the dictionary, setting the brick type of a brick you
wish to ignore to "Invisible" will retain all dependent definitions without 
revealing the undesired brick at runtime.

Stuff on lines beginning with two slashes or between slash star and star slash
are "commented out". They are not in effect, but may be revisited.
 

