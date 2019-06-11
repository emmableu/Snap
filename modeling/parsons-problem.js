/*
prerequisites:
--------------
needs blocks.js, threads.js, objects.js, widgets.js and morphic.js
hierarchy
---------
the following tree lists all constructors hierarchically,
indentation indicating inheritance. Refer to this list to get a
contextual overview:
toc
---
the following list shows the order in which all constructors are
defined. Use this list to locate code in this document:
Check My Work: this is the core functionality for checking whether the student
solution is correct
Show Parsons Problem: present parsons problem for all three lab assignments
function
---
this file implements the parsonsProblem feature for the lab assignments.
*/

/*global */

// Global stuff ////////////////////////////////////////////////////////
modules.parsonsProblem = '2018-Nov-23';


// Check My Work ///////////////////////////////////////////////
var isDialogShowing = false;
var hasHighlight = false;
// Only shows the checking instruction when first click this button
var isFirstCheck = true;
resetDiaglogShowing = function() {
    isDialogShowing = false;
};

popupDialogBox = function(text) {
    if (!isDialogShowing) {
        isDialogShowing = true;
        new DialogBoxMorph(null, resetDiaglogShowing).inform(
            'Check My Work',
            text,
            ide.world()
        );
    }
};

// Get blocks under hat block
getHatBlockIndexMap = function(nextBlock) {
    var blockIndexMap = {};
    var blockIndex = 1;
    while (nextBlock) {
        removeChildrenHighLight(nextBlock);
        if (nextBlock.selector != null) {
            blockIndexMap[nextBlock.selector] = {index: blockIndex, block: nextBlock};
        }
        nextBlock = nextBlock.nextBlock();
        blockIndex++;
    }
    return blockIndexMap;
};

// Demo version answer checking
checkDemo = function(sprite) {
    scripts = sprite.scripts;
    isCorrect = true;
    // highlight blocks not under hatblock
    if (scripts.children.length > 1) {
        isCorrect = false;
        for (var i = 1; i < scripts.children.length; i++) {
            if (scripts.children[i].getHintHighlight() == null) {
                scripts.children[i].addHintHighlight(new Color(255, 255, 0, 1));
                hasHighlight = true;
            }
        }
        if (scripts.children.length == 2
            && scripts.children[0].nextBlock() == null
            && sprite.parsonsProblemPalette.contents.children.length == 0
        ) {
            popupDialogBox(' Please put all blocks under the hat block ');
        }
    }

    // Check blocks under hat
    var nextBlock = scripts.children[0].nextBlock();
    var blockIndexMap = {};
    var blockIndex = 1;
    var subBlockIndexMap = {};
    blockIndexMap = getHatBlockIndexMap(nextBlock);
    if (blockIndexMap['forward']) {
        blockIndexMap['forward'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
        isCorrect = false;
        hasHighlight = true;
    }
    if (blockIndexMap['turn']) {
        blockIndexMap['turn'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
        isCorrect = false;
        hasHighlight = true;
    }
    if (blockIndexMap['doRepeat']) {
        // set var should before repeat
        if (blockIndexMap['doSetVar'] &&
            blockIndexMap['doSetVar'].index > blockIndexMap['doRepeat'].index) {
            blockIndexMap['doSetVar'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
            isCorrect = false;
            hasHighlight = true;
        }
        // pen down should before move and pen up should after the move
        if (blockIndexMap['down'] &&
            blockIndexMap['down'].index > blockIndexMap['doRepeat'].index) {
            blockIndexMap['down'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
            isCorrect = false;
            hasHighlight = true;
        }
        if (blockIndexMap['up'] &&
            blockIndexMap['up'].index < blockIndexMap['doRepeat'].index) {
            blockIndexMap['up'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
            isCorrect = false;
            hasHighlight = true;
        }
        // pen down inside the repeat
        repeatBlock = blockIndexMap['doRepeat'].block;
        blockIndex = 0;
        repeatBlock.children[2].allChildren().forEach(function(block) {
            if (block.selector) {
                subBlockIndexMap[block.selector] = {index: blockIndex, block: block};
                blockIndex++;
            }
        });
        // pen down should before move and pen up should after the move
        if (subBlockIndexMap['down'] &&
            subBlockIndexMap['forward'] &&
            subBlockIndexMap['down'].index > subBlockIndexMap['forward'].index) {
            subBlockIndexMap['down'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
            isCorrect = false;
            hasHighlight = true;
        }
        if (subBlockIndexMap['up'] &&
            (!subBlockIndexMap['down'] ||
                (subBlockIndexMap['forward'] &&
                    subBlockIndexMap['up'].index < subBlockIndexMap['forward'].index))) {
            subBlockIndexMap['up'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
            isCorrect = false;
            hasHighlight = true;
        }

        // set var should before repeat
        if (subBlockIndexMap['doSetVar']) {
            subBlockIndexMap['doSetVar'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
            isCorrect = false;
            hasHighlight = true;
        }
    } else if (blockIndexMap['forward']) {
        // pen down should before move and pen up should after the move
        if (blockIndexMap['down'] &&
            blockIndexMap['down'].index > blockIndexMap['forward'].index) {
            blockIndexMap['down'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
            isCorrect = false;
            hasHighlight = true;
        }
        if (blockIndexMap['up'] &&
            blockIndexMap['down'] &&
            blockIndexMap['up'].index < blockIndexMap['forward'].index) {
            blockIndexMap['up'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
            isCorrect = false;
            hasHighlight = true;
        }
        // sideLength should inside move
        if (!(blockIndexMap['forward'].block.children[1] instanceof ReporterBlockMorph)) {
            isCorrect = false;
        }
    }
    // size should inside move forward
    var forwardInput;
    if (blockIndexMap['forward']) {
        forwardInput = blockIndexMap['forward'].block.children[1];
    } else if (subBlockIndexMap['forward']) {
        forwardInput = subBlockIndexMap['forward'].block.children[1];
    }
    if (forwardInput) {
        if (!(forwardInput instanceof ReporterBlockMorph)) {
            if (forwardInput.addSingleHintHighlight) {
                forwardInput.addSingleHintHighlight(new Color(0, 0, 255, 1));
                hasHighlight = true;
            }
            isCorrect = false;
        }
    }
    return isCorrect;
};

// Check Polygon Maker
var PolygonMakerDefinition;
var hasOpenedBlock = false;
var polygonMakerBlockEditor;
checkPolygonMaker = function(sprite) {
    scripts = sprite.scripts;
    isCorrect = true;
    // highlight blocks not in custom block
    scripts.children.forEach(function(script) {
        if (script instanceof SyntaxElementMorph &&
            script.blockSequence &&
            script.blockSequence().forEach) {
            script.blockSequence().forEach(function(block) {
                if (block instanceof SyntaxElementMorph &&
                    !(block instanceof CustomCommandBlockMorph) &&
                    !(block instanceof CustomReporterBlockMorph)) {
                    if (block.getHintHighlight() == null) {
                        block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                        hasHighlight = true;
                    }
                    isCorrect = false;
                }
            });
        }
        // highlight reporter morph
        if (script instanceof SyntaxElementMorph &&
            !(script instanceof CustomCommandBlockMorph) &&
            !(script instanceof CustomReporterBlockMorph) &&
            !(script instanceof HatBlockMorph)
        ) {
            if (script.getHintHighlight() == null) {
                script.addSingleHintHighlight(new Color(255, 255, 0, 1));
                hasHighlight = true;
            }
            isCorrect = false;
        }
    });

    if (!isCorrect
        && sprite.parsonsProblemPalette.contents.children.length == 0
        && !BlockEditorMorph.showing[0]
    ) {
        popupDialogBox(' Please put all blocks in the custom block \n (Right click on the custom block to edit it) ');
    }


    // Current issue: student needs to reopen the block to view the check
    var newBlockEditor = BlockEditorMorph.showing[0] || polygonMakerBlockEditor;
    var blockEditorScripts;
    if (newBlockEditor) {
        blockEditorScripts = {};
        blockEditorScripts.children = newBlockEditor.body.contents.children;
        blockEditorScripts.mainBodyBlock = blockEditorScripts.children[0];
    } else if (PolygonMakerDefinition && PolygonMakerDefinition.body) {
        blockEditorScripts = {};
        // PolygonMakerDefinition.scripts this spreads every where
        blockEditorScripts.children = PolygonMakerDefinition.scripts;
        blockEditorScripts.mainBodyBlock = PolygonMakerDefinition.body.expression;
    }
    var blockIndexMap = {};
    var blockIndex = 1;
    var subBlockIndexMap = {};
    if (blockEditorScripts) {
        // highlight blocks not connected to the custom block
        for (var i = 1; i < blockEditorScripts.children.length; i++) {
            if (blockEditorScripts.children[i] instanceof SyntaxElementMorph &&
                blockEditorScripts.children[i].getHintHighlight() == null) {
                isCorrect = false;
                blockEditorScripts.children[i].addHintHighlight(new Color(255, 255, 0, 1));
                hasHighlight = true;
            }
        }
        blockEditorScripts.mainBodyBlock.blockSequence().forEach(function(block){
            block.allChildren().forEach(function (subBlock) {
                if (subBlock instanceof CommandBlockMorph ||
                    subBlock instanceof ReporterBlockMorph ||
                    subBlock instanceof HatBlockMorph ||
                    subBlock instanceof BlockMorph ||
                    subBlock instanceof PrototypeHatBlockMorph ||
                    subBlock instanceof CustomCommandBlockMorph ||
                    subBlock instanceof InputSlotMorph) {
                    // remove highlight on correct blocks
                    if (subBlock.getHintHighlight()) {
                        subBlock.removeHintHighlight();
                    }
                }
            });
            if (block.selector != null) {
                if (block.selector == 'forward' ||
                    block.selector == 'turn') {
                    if (block.getHintHighlight() == null) {
                        block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                        hasHighlight = true;
                        isCorrect = false;
                    }
                }
                blockIndexMap[block.selector] = {index: blockIndex, block: block};
            }
            blockIndex++;
        });
        if (blockIndexMap['doRepeat']) {
            // set pen size should before move
            if (blockIndexMap['setSize'] &&
                blockIndexMap['setSize'].index > blockIndexMap['doRepeat'].index) {
                blockIndexMap['setSize'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                hasHighlight = true;
                isCorrect = false;
            }
            // pen down should before move and pen up should after the move
            if (blockIndexMap['down'] &&
                blockIndexMap['down'].index > blockIndexMap['doRepeat'].index) {
                blockIndexMap['down'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                hasHighlight = true;
                isCorrect = false;
            }
            if (blockIndexMap['up'] &&
                blockIndexMap['up'].index < blockIndexMap['doRepeat'].index) {
                blockIndexMap['up'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                hasHighlight = true;
                isCorrect = false;
            }
            // pen down inside the repeat
            repeatBlock = blockIndexMap['doRepeat'].block;
            blockIndex = 0;
            repeatBlock.children[2].allChildren().forEach(function(block) {
                if (block.selector) {
                    subBlockIndexMap[block.selector] = {index: blockIndex, block: block};
                    blockIndex++;
                }
            });
            // pen down should before move and pen up should after the move
            if (subBlockIndexMap['down'] &&
                subBlockIndexMap['forward'] &&
                subBlockIndexMap['down'].index > subBlockIndexMap['forward'].index) {
                subBlockIndexMap['down'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                hasHighlight = true;
                isCorrect = false;
            }
            if (subBlockIndexMap['up'] &&
                (!subBlockIndexMap['down'] ||
                    (subBlockIndexMap['forward'] &&
                        subBlockIndexMap['up'].index < subBlockIndexMap['forward'].index))) {
                subBlockIndexMap['up'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                hasHighlight = true;
                isCorrect = false;
            }
            // set pen size should before move
            if (subBlockIndexMap['setSize'] &&
                subBlockIndexMap['forward'] &&
                subBlockIndexMap['setSize'].index > subBlockIndexMap['forward'].index) {
                subBlockIndexMap['setSize'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                hasHighlight = true;
                isCorrect = false;
            }
            // sides should inside repeat
            var repeatInput = blockIndexMap['doRepeat'].block.children[1];
            if (!(repeatInput instanceof ReporterBlockMorph)) {
                if (repeatInput.addSingleHintHighlight) {
                    repeatInput.addSingleHintHighlight(new Color(0, 0, 255, 1));
                    hasHighlight = true;
                }
                isCorrect = false;
            } else if (repeatInput instanceof ReporterBlockMorph) {
                if (repeatInput.blockSpec != 'Sides') {
                    repeatInput.addSingleHintHighlight(new Color(255, 255, 0, 1));
                    hasHighlight = true;
                    isCorrect = false;
                }
            }
        } else if (blockIndexMap['forward']) {
            // pen down should before move and pen up should after the move
            if (blockIndexMap['down'] &&
                blockIndexMap['down'].index > blockIndexMap['forward'].index) {
                blockIndexMap['down'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                hasHighlight = true;
                isCorrect = false;
            }
            if (blockIndexMap['up'] &&
                blockIndexMap['down'] &&
                blockIndexMap['up'].index < blockIndexMap['forward'].index) {
                blockIndexMap['up'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                hasHighlight = true;
                isCorrect = false;
            }
            // set pen size should before move
            if (blockIndexMap['setSize'] &&
                blockIndexMap['setSize'].index > blockIndexMap['forward'].index) {
                blockIndexMap['setSize'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                hasHighlight = true;
                isCorrect = false;
            }
        }
        // size should inside move forward
        var forwardInput;
        if (blockIndexMap['forward']) {
            forwardInput = blockIndexMap['forward'].block.children[1];
        } else if (subBlockIndexMap['forward']) {
            forwardInput = subBlockIndexMap['forward'].block.children[1];
        }
        if (forwardInput) {
            if (!(forwardInput instanceof ReporterBlockMorph)) {
                if (forwardInput.addSingleHintHighlight) {
                    hasHighlight = true;
                    forwardInput.addSingleHintHighlight(new Color(0, 0, 255, 1));
                }
                isCorrect = false;
            } else if (forwardInput instanceof ReporterBlockMorph) {
                if (forwardInput.blockSpec != 'Size') {
                    hasHighlight = true;
                    forwardInput.addSingleHintHighlight(new Color(255, 255, 0, 1));
                    isCorrect = false;
                }
            }
        }
        // thickness should inside set pen size
        var setSizeInput;
        if (blockIndexMap['setSize']) {
            setSizeInput = blockIndexMap['setSize'].block.children[4];
        } else if (subBlockIndexMap['setSize']) {
            setSizeInput = subBlockIndexMap['setSize'].block.children[4];
        }
        if (setSizeInput) {
            if (!(setSizeInput instanceof ReporterBlockMorph)) {
                if (setSizeInput.addSingleHintHighlight) {
                    hasHighlight = true;
                    setSizeInput.addSingleHintHighlight(new Color(0, 0, 255, 1));
                }
                isCorrect = false;
            } else if (setSizeInput instanceof ReporterBlockMorph) {
                if (setSizeInput.blockSpec != 'Thickness') {
                    hasHighlight = true;
                    setSizeInput.addSingleHintHighlight(new Color(255, 255, 0, 1));
                    isCorrect = false;
                }
            }
        }
        // 360/() should inside turn block
        var turnInput;
        if (blockIndexMap['turn']) {
            turnInput = blockIndexMap['turn'].block.children[2];
        } else if (subBlockIndexMap['turn']) {
            turnInput = subBlockIndexMap['turn'].block.children[2];
        }
        if (turnInput) {
            if (!(turnInput instanceof ReporterBlockMorph)) {
                if (turnInput.addSingleHintHighlight) {
                    hasHighlight = true;
                    turnInput.addSingleHintHighlight(new Color(0, 0, 255, 1));
                }
                isCorrect = false;
            } else if (turnInput instanceof ReporterBlockMorph) {
                if (turnInput.blockSpec != '%n / %n') {
                    hasHighlight = true;
                    turnInput.addSingleHintHighlight(new Color(255, 255, 0, 1));
                    isCorrect = false;
                } else if (turnInput.blockSpec == '%n / %n') {
                    secondInput = turnInput.children[2];
                    if (!(secondInput instanceof ReporterBlockMorph)) {
                        if (secondInput.addSingleHintHighlight) {
                            hasHighlight = true;
                            secondInput.addSingleHintHighlight(new Color(0, 0, 255, 1));
                        }
                        isCorrect = false;
                    } else if (secondInput instanceof ReporterBlockMorph) {
                        if (secondInput.blockSpec != 'Sides') {
                            hasHighlight = true;
                            secondInput.addSingleHintHighlight(new Color(255, 255, 0, 1));
                            isCorrect = false;
                        }
                    }
                }
            }
        }
    }
    if (!BlockEditorMorph.showing[0] && !isCorrect && hasOpenedBlock) {
        popupDialogBox(' Please fix all misplaced blocks in the custom block ');
    }
    return isCorrect;
};

getSubBlockIndexMap = function(aCSlotMorph) {
    var blockIndex = 1;
    var subBlockIndexMap = {};
    if (!aCSlotMorph.children[0]) return subBlockIndexMap;
    if (!aCSlotMorph.children[0].blockSequence) return subBlockIndexMap;
    aCSlotMorph.children[0].blockSequence().forEach(function(block) {
        removeHighLight(block);
        if (block.selector) {
            if (subBlockIndexMap[block.selector]) {
                id = subBlockIndexMap[block.selector].nextId;
                nextId = id + 1;
                subBlockIndexMap[block.selector].nextId = nextId;
                subBlockIndexMap[block.selector + id] = {index: blockIndex, block: block, id: nextId};
            } else {
                subBlockIndexMap[block.selector] = {index: blockIndex, block: block, nextId: 1};
            }
            blockIndex++;
        }
    });
    return subBlockIndexMap;
};
// Check Pong 1
checkRightPaddle = function(sprite, currentSprite) {
    scripts = sprite.scripts;
    isCorrect = true;
    // highlight blocks not under hatblock
    // Need to consider commentMorph as well, do not use index, which may cause
    // bugs since the exact block does not match to the index
    var hatBlock = scripts.allChildren().filter(function(block) {
        return block instanceof HatBlockMorph;
    });

    if (hatBlock) {
        hatBlock = hatBlock[0];
    }

    var nonCommentChildren = scripts.children.filter(function(block) {
        return !(block instanceof CommentMorph);
    });
    if (nonCommentChildren.length > 1) {
        isCorrect = false;
        for (var i = 0; i < nonCommentChildren.length; i++) {
            if (!(nonCommentChildren[i] instanceof HatBlockMorph)
                &&  nonCommentChildren[i].getHintHighlight() == null) {
                nonCommentChildren[i].addHintHighlight(new Color(255, 255, 0, 1));
                hasHighlight = true;
            }
        }
        if (nonCommentChildren.length == 2
            && sprite.parsonsProblemPalette.contents.children.length == 0
            && sprite == currentSprite
        ) {
            popupDialogBox(' Please put all blocks under the hat block ');
        }
    }
    // Check blocks under hat
    var nextBlock = hatBlock.nextBlock();
    var blockIndexMap = getHatBlockIndexMap(nextBlock);
    if (blockIndexMap['bounceOffEdge']
        && blockIndexMap['bounceOffEdge'].block.getHintHighlight() == null) {
        blockIndexMap['bounceOffEdge'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
        hasHighlight = true;
        isCorrect = false;
    }
    if (blockIndexMap['setYPosition']
        && blockIndexMap['setYPosition'].block.getHintHighlight() == null) {
        blockIndexMap['setYPosition'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
        isCorrect = false;
        hasHighlight = true;
    }

    var subBlockIndexMap = {};
    if (blockIndexMap['doForever']) {
        // bounce and set y inside the forever loop
        foreverBlock = blockIndexMap['doForever'].block;
        blockIndex = 0;
        foreverBlock.children[1].allChildren().forEach(function(block) {
            if (block.selector) {
                subBlockIndexMap[block.selector] = {index: blockIndex, block: block};
                blockIndex++;
            }
        });
        // set size should be outside forever
        if (subBlockIndexMap['setScale']) {
            subBlockIndexMap['setScale'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
            isCorrect = false;
            hasHighlight = true;
        }
        // goto should be outside forever
        if (subBlockIndexMap['gotoXY']) {
            subBlockIndexMap['gotoXY'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
            isCorrect = false;
            hasHighlight = true;
        }
    }
    // mouse Y should inside set Y position
    var setYInput;
    if (blockIndexMap['setYPosition']) {
        setYInput = blockIndexMap['setYPosition'].block.children[3];
    } else if (subBlockIndexMap['setYPosition']) {
        setYInput = subBlockIndexMap['setYPosition'].block.children[3];
    }
    if (setYInput) {
        if (!(setYInput instanceof ReporterBlockMorph)) {
            if (setYInput.addSingleHintHighlight) {
                setYInput.addSingleHintHighlight(new Color(0, 0, 255, 1));
                hasHighlight = true;
            }
            isCorrect = false;
        }
    }

    if (sprite.parsonsProblemPalette.contents.children.length > 0) {
        isCorrect = false;
    }

    return isCorrect;
};

checkInput = function (input, selector) {
    if (input) {
        if (input.getHintHighlight &&
            input.getHintHighlight()) {
            input.removeHintHighlight();
        }
        if (!input.selector) {
            if (input.addSingleHintHighlight) {
                input.addSingleHintHighlight(
                    new Color(0, 0, 255, 1));
                hasHighlight = true;
            }
            return false;
        }
        if (input.selector
            && input.selector != selector) {
            if (input.addSingleHintHighlight) {
                input.addSingleHintHighlight(
                    new Color(255, 255, 0, 1));
                hasHighlight = true;
            }
            return false;
        }
    }
    return true;
};

checkBall = function(sprite, currentSprite) {
    scripts = sprite.scripts;
    isCorrect = true;

    var firstCheckBlocks = scripts.allChildren().filter(function(block) {
        if (block.selector) {
            return (block.selector == 'receiveGo'
                || block.selector == 'receiveKey'
                || block.selector == 'setHeading'
                || block.selector == 'reportDifference'
                || block.selector == 'reportGreaterThan');
        }
    });

    // Get possible hatblocks, including go block and whenKeyPressed block
    var hatBlock = firstCheckBlocks.filter(function(block) {
        return block instanceof HatBlockMorph;
    });


    var nonCommentChildren = scripts.children.filter(function(block) {
        return !(block instanceof CommentMorph);
    });
    if ((hatBlock.length == 1 && nonCommentChildren.length > 1)
        || (hatBlock.length == 2 && nonCommentChildren.length > 2)) {
        isCorrect = false;
        for (var i = 0; i < nonCommentChildren.length; i++) {
            if (!(nonCommentChildren[i] instanceof HatBlockMorph)
                &&  nonCommentChildren[i].getHintHighlight() == null) {
                nonCommentChildren[i].addHintHighlight(new Color(255, 255, 0, 1));
                hasHighlight = true;
            }
        }
        if (nonCommentChildren.length == 2
            && sprite.parsonsProblemPalette.contents.children.length == 0
            && sprite == currentSprite
        ) {
            popupDialogBox(' Please put blocks under hat blocks ');
        }
    }

    // Check blocks under each hat block
    var goHatBlock = hatBlock.filter(function(block) {
        return block.selector == 'receiveGo';
    });
    goHatBlock = goHatBlock[0];
    var keyHatBlock = hatBlock.filter(function(block) {
        return block.selector == 'receiveKey';
    });
    keyHatBlock = keyHatBlock[0];

    // Check receiveGO Block: setScale, doSetVar should before evaluateCustomBlock
    // "receiveGo"
    // "setScale"
    // "doSetVar"
    // those two must before the evaluateCustomBlock (resetball)
    // "evaluateCustomBlock" "CustomCommandBlockMorph" only one resetBall is allowed
    if (goHatBlock) {
        var nextBlock = goHatBlock.nextBlock();
        var blockIndexMap = {};
        var blockIndex = 0;
        while (nextBlock) {
            removeChildrenHighLight(nextBlock);
            if (nextBlock.selector != null) {
                if (blockIndexMap[nextBlock.selector]) {
                    // duplicate block should be highlighted as well, such as setVar or customblock
                    nextBlock.addSingleHintHighlight(new Color(255, 255, 0, 1));
                    hasHighlight = true;
                    isCorrect = false;
                } else {
                    blockIndexMap[nextBlock.selector] = {index: blockIndex, block: nextBlock};
                }
            }
            nextBlock = nextBlock.nextBlock();
            blockIndex++;
        }
        allBlocks = Object.keys(blockIndexMap);
        // highlight all the blocks except for the needed three blocks
        if (allBlocks) {
            allBlocks.forEach(function (selector) {
                if (selector != 'setScale'
                    && selector != 'doSetVar'
                    && selector != 'evaluateCustomBlock') {
                    blockIndexMap[selector].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                    hasHighlight = true;
                    isCorrect = false;
                }
            });
        }
        // setScale, doSetVar should before evaluateCustomBlock
        if (blockIndexMap['setScale']
            && blockIndexMap['doSetVar']
            && blockIndexMap['evaluateCustomBlock']) {
            if (blockIndexMap['setScale'].index > blockIndexMap['evaluateCustomBlock'].index) {
                blockIndexMap['setScale'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                hasHighlight = true;
                isCorrect = false;
            }
            if (blockIndexMap['doSetVar'].index > blockIndexMap['evaluateCustomBlock'].index) {
                blockIndexMap['doSetVar'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                hasHighlight = true;
                isCorrect = false;
            }
        } else {
            isCorrect = false;
        }
        // TODO: May notify the user if the block under Go hat block is correct
    }

    // Check receiveKey Block:
    // "receiveKey"
    //     "doForever"
    //         "Forward"
    //         "bounceOffEdge"
    //         "doIf"
    //             [1] "reportTouchingObject"
    //             [2] "setHeading"
    //                  [3] "reportDifference"
    //                          [3] "direction"
    //             "doChangeVar"
    //         "doIf"
    //             [1] "reportGreaterThan"
    //                  [0] "xPosition"
    //             [2] "doSetVar"
    //             "evaluateCustomBlock"

    if (keyHatBlock) {
        nextBlock = keyHatBlock.nextBlock();
        blockIndexMap = {};
        blockIndex = 1;
        while (nextBlock) {
            removeChildrenHighLight(nextBlock);
            if (nextBlock.selector != null) {
                if (blockIndexMap[nextBlock.selector]) {
                    // duplicate block should be highlighted as well, such as setVar or customblock
                    nextBlock.addSingleHintHighlight(new Color(255, 255, 0, 1));
                    hasHighlight = true;
                    isCorrect = false;
                } else {
                    blockIndexMap[nextBlock.selector] = {index: blockIndex, block: nextBlock};
                }
            }
            nextBlock = nextBlock.nextBlock();
            blockIndex++;
        }
        allBlocks = Object.keys(blockIndexMap);
        // highlight all the blocks except for 'doForever'
        if (allBlocks) {
            allBlocks.forEach(function (selector) {
                if (selector != 'doForever') {
                    blockIndexMap[selector].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                    hasHighlight = true;
                    isCorrect = false;
                }
            });
        }

        // Check blocks inside doForever
        if (blockIndexMap['doForever']) {
            // bounce and set y inside the forever loop
            foreverBlock = blockIndexMap['doForever'].block;
            blockIndex = 0;
            foreverSubBlockIndexMap = getSubBlockIndexMap(foreverBlock.children[1]);
            // hilight blocks except for if, move and bounce


            allDirectChildOfForever = Object.keys(foreverSubBlockIndexMap);
            // highlight all the blocks except for 'doForever'
            if (allDirectChildOfForever) {
                allDirectChildOfForever.forEach(function (selector) {
                    if (selector != 'forward'
                        && selector != 'bounceOffEdge'
                        && selector != 'doIf'
                        && selector != 'doIf1') {
                        foreverSubBlockIndexMap[selector].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                        hasHighlight = true;
                        isCorrect = false;
                    }
                });
            }
            // move, bounce, and if should be inside forever
            if (!foreverSubBlockIndexMap['forward']
                || !foreverSubBlockIndexMap['bounceOffEdge']
                || !foreverSubBlockIndexMap['doIf']
                || !foreverSubBlockIndexMap['doIf1']) {
                isCorrect = false;
            }

            // Check each of the if statement
            // use the first available block inside to decide which if block this belongs to
            checkIfGettingScore = function(ifBlock) {
                var ifSubBlockIndexMap = getSubBlockIndexMap(ifBlock.children[2]);
                var isCorrect = true;
                // check point to and change block, highlight unnessary block
                var subBlockSelectors = Object.keys(ifSubBlockIndexMap);
                if (subBlockSelectors) {
                    subBlockSelectors.forEach(function (selector) {
                        if (selector != 'setHeading'
                            && selector != 'doChangeVar') {
                            ifSubBlockIndexMap[selector].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                            isCorrect = false;
                            hasHighlight = true;
                        }
                    });
                }

                // setHeading and doChangeVar should inside the block
                if (!ifSubBlockIndexMap['setHeading']
                    || !ifSubBlockIndexMap['doChangeVar']) {
                    isCorrect = false;
                }

                // touch right paddle should be inside if
                var ifInput = ifBlock.children[1];
                if (!checkInput(ifInput, 'reportTouchingObject')) {
                    isCorrect = false;
                }
                return isCorrect;
            };

            checkIfLoseGame = function(ifBlock) {
                var ifSubBlockIndexMap = getSubBlockIndexMap(ifBlock.children[2]);
                var isCorrect = true;
                // check set var and custom block, highlight unnessary block
                var subBlockSelectors = Object.keys(ifSubBlockIndexMap);
                if (subBlockSelectors) {
                    subBlockSelectors.forEach(function (selector) {
                        if (selector != 'doSetVar'
                            && selector != 'evaluateCustomBlock') {
                            ifSubBlockIndexMap[selector].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                            isCorrect = false;
                            hasHighlight = true;
                        }
                    });
                }

                // setVar should before custom block
                if (ifSubBlockIndexMap['doSetVar']
                    && ifSubBlockIndexMap['evaluateCustomBlock']) {
                    if (ifSubBlockIndexMap['doSetVar'].index >
                        ifSubBlockIndexMap['evaluateCustomBlock'].index) {
                        ifSubBlockIndexMap['doSetVar'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                        isCorrect = false;
                        hasHighlight = true;
                    }
                } else {
                    isCorrect = false;
                }

                // check x position should be inside if
                var ifInput = ifBlock.children[1];
                if (!checkInput(ifInput, 'reportGreaterThan')) {
                    isCorrect = false;
                }
                return isCorrect;
            };


            checkIfBlock = function(ifBlock) {
                var ifInput = ifBlock.children[1];
                if (ifInput && ifInput.selector) {
                    if (ifInput.selector == 'reportTouchingObject') {
                        if(!checkIfGettingScore(ifBlock)) {
                            return false;
                        }
                    } else if (ifInput.selector == 'reportGreaterThan') {
                        if(!checkIfLoseGame(ifBlock)) {
                            return false;
                        }
                    }
                }

                var firstChildOfIf = ifBlock.children[2].children[0];
                if (firstChildOfIf && firstChildOfIf.selector) {
                    if (firstChildOfIf.selector == 'setHeading'
                        || firstChildOfIf.selector == 'doChangeVar' ) {
                        if (!checkIfGettingScore(ifBlock)) {
                            return false;
                        }
                    } else if (firstChildOfIf.selector == 'doSetVar'
                        || firstChildOfIf.selector == 'evaluateCustomBlock' ) {
                        if (!checkIfLoseGame(ifBlock)) {
                            return false;
                        }
                    }
                }
                return true;
            };

            if (foreverSubBlockIndexMap['doIf']) {
                ifBlock = foreverSubBlockIndexMap['doIf'].block;
                if (!checkIfBlock(ifBlock)) {
                    isCorrect = false;
                }
            }

            if (foreverSubBlockIndexMap['doIf1']) {
                ifBlock = foreverSubBlockIndexMap['doIf1'].block;
                if (!checkIfBlock(ifBlock)) {
                    isCorrect = false;
                }
            }
        }
    }

    // Check inputs at all circumstances, including setHeading, reportDifference,
    // greaterThan
    inputBlockMap = {};
    firstCheckBlocks.forEach(function(block){
        inputBlockMap[block.selector] = block;
    });


    if (inputBlockMap['setHeading']) {
        var directionInput = inputBlockMap['setHeading'].children[3];
        if (!checkInput(directionInput, 'reportDifference')) {
            isCorrect = false;
        }
    }
    if (inputBlockMap['reportDifference']) {
        var secondInput = inputBlockMap['reportDifference'].children[2];
        if (!checkInput(secondInput, 'direction')) {
            isCorrect = false;
        }
    }
    if (inputBlockMap['reportGreaterThan']) {
        greaterThanInput = inputBlockMap['reportGreaterThan'].children[0];
        if (!checkInput(greaterThanInput, 'xPosition')) {
            isCorrect = false;
        }
    }

    if (sprite.parsonsProblemPalette.contents.children.length > 0) {
        isCorrect = false;
    }

    return isCorrect;
};

checkPongOne = function(sprites, currentSprite) {
    // if one sprite is correct, check another one
    var isCorrect = true;
    var isSpriteCorrect = [true, true];
    var RP_INDEX = 0, BALL_INDEX = 1;
    // Check each sprite, notify the user if either one of them is incorrect
    var rightPaddle = sprites[RP_INDEX];
    var ball = sprites[BALL_INDEX];
    // Check rightPaddle ---------------------
    isSpriteCorrect[RP_INDEX] = checkRightPaddle(rightPaddle, currentSprite);
    isSpriteCorrect[BALL_INDEX] = checkBall(ball, currentSprite);

    if (isSpriteCorrect[RP_INDEX] && isSpriteCorrect[BALL_INDEX]) {
        isCorrect = true;
    } else {
        isCorrect = false;
        // Check which sprite is correct and notify the user
        // 0 1 (c)
        if (isSpriteCorrect[RP_INDEX] && currentSprite == rightPaddle) {
            popupDialogBox(' Your Right Paddle sprite is correct, \n but you may need to work on the Ball sprite');
        }
        // 1 (c) 0
        if (isSpriteCorrect[BALL_INDEX] && currentSprite == ball) {
            popupDialogBox(' Your Ball sprite is correct, \n but you may need to work on the Right Paddle sprite');
        }
    }
    return isCorrect;
};



////////////////////////////////////////////////////////////////////////
// Check Guessing Game 1
////////////////////////////////////////////////////////////////////////
checkGGComparisonInput = function(compareBlock) {
    isInputCorrect = true;
    var firstInput = compareBlock.children[0];
    var secondInput = compareBlock.children[2];

    if (secondInput.getHintHighlight &&
        secondInput.getHintHighlight()) {
        secondInput.removeHintHighlight();
    }
    if (!secondInput.selector) {
        if (secondInput.addSingleHintHighlight) {
            secondInput.addSingleHintHighlight(
                new Color(0, 0, 255, 1));
            hasHighlight = true;
        }
        isInputCorrect = false;
    }

    firstGetVar = checkInput(firstInput, 'reportGetVar');
    if (firstGetVar) {
        if(!checkInput(secondInput, 'getLastAnswer')) {
            isInputCorrect = false;
        }
    } else {
        firstGetVar = checkInput(firstInput, 'getLastAnswer');
        if (firstGetVar) {
            if (!checkInput(secondInput, 'reportGetVar')) {
                isInputCorrect = false;
            }
        } else {
            isInputCorrect = false;
        }
    }
    return isInputCorrect;
};

checkGGInputs = function(firstCheckBlocks) {
    // Check inputs at all circumstances
    var isInputCorrect = true;
    inputBlockMap = {};
    firstCheckBlocks.forEach(function(block){
        inputBlockMap[block.selector] = block;
        if (block.selector == 'reportEquals'
            || block.selector == 'reportLessThan'
            || block.selector == 'reportGreaterThan') {
            if (!checkGGComparisonInput(block)) {
                isInputCorrect = false;
            }
        }
        // Check say 'hello and name'
        if (block.selector == 'doSayFor') {
            if (block.children[1] instanceof ReporterBlockMorph
                || (block.children[1] instanceof InputSlotMorph
                    && block.children[1].children[0].text.length == 0)
            ) {
                var sayInput = block.children[1];
                if (!checkInput(sayInput, 'reportJoinWords')) {
                    isInputCorrect = false;
                }
            }
        }
        // Check do If
        if (block.selector == 'doIf') {
            ifInput = block.children[1];
            if (ifInput.getHintHighlight &&
                ifInput.getHintHighlight()) {
                ifInput.removeHintHighlight();
            }
            if (!ifInput.selector) {
                if (ifInput.addSingleHintHighlight) {
                    ifInput.addSingleHintHighlight(
                        new Color(0, 0, 255, 1));
                    hasHighlight = true;
                }
                isInputCorrect = false;
            }
        }
    });

    if (inputBlockMap['reportJoinWords']) {
        var joinInput = inputBlockMap['reportJoinWords'].children[1].children[2];
        if (!checkInput(joinInput, 'getLastAnswer')) {
            isInputCorrect = false;
        }
    }

    // Check set Variable
    if (inputBlockMap['doSetVar']) {
        var setVarInput = inputBlockMap['doSetVar'].children[3];
        if (!checkInput(setVarInput, 'reportRandom')) {
            isInputCorrect = false;
        }
    }

    // Check repeatUntil and reportEquals
    if (inputBlockMap['doUntil']) {
        var untilInput = inputBlockMap['doUntil'].children[2];
        if (!checkInput(untilInput, 'reportEquals')) {
            isInputCorrect = false;
        }
    }

    return isInputCorrect;
};

checkGreetingAndSetRandom = function(blockIndexMap) {
    var isGreetingCorrect = true;
    var greetIndexMap = {};
    // say, ask, say, set
    // extract the exact say, ask, say that we need
    allBlocks = Object.keys(blockIndexMap);
    allBlocks.forEach(function(selector){
        isNeeded = false;
        if (selector.indexOf('doSayFor') != -1) {
            var inputBlock = blockIndexMap[selector].block.children[1];
            if (inputBlock instanceof InputSlotMorph) {
                if (inputBlock.children[0].text.indexOf('Welcome') != -1) {
                    greetIndexMap['sayWelcome'] = blockIndexMap[selector];
                    isNeeded = true;
                }
                if (inputBlock.children[0].text.length == 0) {
                    greetIndexMap['sayName'] = blockIndexMap[selector];
                    isNeeded = true;
                }
            } else if (inputBlock instanceof ReporterBlockMorph) {
                greetIndexMap['sayName'] = blockIndexMap[selector];
                isNeeded = true;
            }
        } else if (selector.indexOf('doAsk') != -1) {
            inputBlock = blockIndexMap[selector].block.children[1];
            if (inputBlock instanceof InputSlotMorph) {
                if (inputBlock.children[0].text.indexOf('name') != -1) {
                    greetIndexMap['askName'] = blockIndexMap[selector];
                    isNeeded = true;
                }
            }
        }
        if (!isNeeded) {
            greetIndexMap[selector] = blockIndexMap[selector];
        }
    });
    // highlight all the other blocks
    Object.keys(greetIndexMap).forEach(function(selector) {
        if (selector != 'askName'
            && selector != 'sayName'
            && selector != 'doSetVar'
            && selector != 'sayWelcome'
            && selector != 'doUntil') {
            greetIndexMap[selector].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
            isGreetingCorrect = false;
            hasHighlight = true;
        }
        // setVar can be anywhere but before repeat until,
        if (greetIndexMap['doUntil']) {
            if (selector == 'askName'
                || selector == 'sayName'
                || selector == 'doSetVar'
                || selector == 'sayWelcome'
                || selector == 'doUntil') {
                if (greetIndexMap[selector].index >
                    greetIndexMap['doUntil'].index) {
                    greetIndexMap[selector].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                    isGreetingCorrect = false;
                    hasHighlight = true;
                }
            }
        }
    });
    // say name should after ask name
    if (greetIndexMap['sayName']
        && greetIndexMap['askName']
        && greetIndexMap['sayName'].index < greetIndexMap['askName'].index) {
        greetIndexMap['sayName'].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
        isGreetingCorrect = false;
        hasHighlight = true;
    }

    if (!greetIndexMap['sayName']
        || !greetIndexMap['askName']
        || !greetIndexMap['sayWelcome']
        || !blockIndexMap['doSetVar']) {
        isGreetingCorrect = false;
    }
    return isGreetingCorrect;
};

checkGuessFeedback = function(blockIndexMap) {
    var isFeedbackCorrect = true;
    if (blockIndexMap['doUntil']) {
        doUntilBlock = blockIndexMap['doUntil'].block;
        var doUntilIndexMap = getSubBlockIndexMap(doUntilBlock.children[3]);
        // highlight all the other blocks
        Object.keys(doUntilIndexMap).forEach(function(selector) {
            if (selector.indexOf('doAsk') != -1) {
                // ask guessing number block should be the first inside doUntil
                if (doUntilIndexMap[selector].index != 1
                    || doUntilIndexMap[selector].block.children[1].children[0].text.indexOf('Take a guess') == -1) {
                    doUntilIndexMap[selector].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                    isFeedbackCorrect = false;
                    hasHighlight = true;
                }
            }
            if (selector.indexOf('doSayFor') != -1
                || selector.indexOf('doSetVar') != -1 ) {
                doUntilIndexMap[selector].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                isFeedbackCorrect = false;
                hasHighlight = true;
            }
        });


        console.log(doUntilIndexMap);

        // TODO: this is the last step
        checkGGIfNotEqual = function(ifBlock) {
            var ifSubBlockIndexMap = getSubBlockIndexMap(ifBlock.children[2]);
            var isIfNotEqualCorrect = true;
            // check say block, highlight unnessary block
            Object.keys(ifSubBlockIndexMap).forEach(function (selector) {
                if (selector.indexOf('doSayFor') == -1) {
                    ifSubBlockIndexMap[selector].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                    isIfNotEqualCorrect = false;
                    hasHighlight = true;
                } else {
                    var sayInput = ifSubBlockIndexMap[selector].block.children[1];
                    if (sayInput instanceof ReporterBlockMorph
                        || sayInput.children[0].text.indexOf('Your guess') == -1) {
                        ifSubBlockIndexMap[selector].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                        isIfNotEqualCorrect = false;
                        hasHighlight = true;
                    } else if (sayInput.children[0].text.indexOf('Congratulations') != -1) {
                        hasCongrats = true;
                    }
                }
            });

            // answer less than secret number
            // A < B or B > A && say too small
            checkLessThan = function(ifBlock) {
                var isLessThanCorrect = true;
                var ifInput = ifBlock.children[1];
                if (ifInput && ifInput.selector) {
                    if (ifInput.selector == 'reportLessThan') {
                        var firstInput = ifInput.children[0];
                        var secondInput = ifInput.children[2];

                        if (firstInput && firstInput.selector
                            && firstInput.selector == 'getLastAnswer'
                            && secondInput && secondInput.selector
                            && secondInput.selector == 'reportGetVar'){
                            nop();
                        } else {
                            isLessThanCorrect = false;
                        }
                    } else if (ifInput.selector == 'reportGreaterThan') {
                        firstInput = ifInput.children[0];
                        secondInput = ifInput.children[2];

                        if (firstInput && firstInput.selector
                            && firstInput.selector == 'reportGetVar'
                            && secondInput && secondInput.selector
                            && secondInput.selector == 'getLastAnswer') {
                            nop();
                        } else {
                            isLessThanCorrect = false;
                        }
                    }
                }
                if (isLessThanCorrect) {
                    if (ifBlock.children[2].children[0]
                        && ifBlock.children[2].children[0].blockSequence) {
                        ifBlock.children[2].children[0].blockSequence().forEach(function(block) {
                            if (block.selector == 'doSayFor') {
                                if (block.children[1].children[0].text.indexOf('too small') == -1) {
                                    block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                                    isLessThanCorrect = false;
                                    hasHighlight = true;
                                }
                            } else {
                                block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                                isLessThanCorrect = false;
                                hasHighlight = true;
                            }
                        });
                    }
                }
                return isLessThanCorrect;
            };

            checkGreaterThan = function(ifBlock) {
                var isGreaterThanCorrect = true;
                var ifInput = ifBlock.children[1];
                if (ifInput && ifInput.selector) {
                    if (ifInput.selector == 'reportGreaterThan') {
                        var firstInput = ifInput.children[0];
                        var secondInput = ifInput.children[2];

                        if (firstInput && firstInput.selector
                            && firstInput.selector == 'getLastAnswer'
                            && secondInput && secondInput.selector
                            && secondInput.selector == 'reportGetVar'){
                            nop();
                        } else {
                            isGreaterThanCorrect = false;
                        }
                    } else if (ifInput.selector == 'reportLessThan') {
                        firstInput = ifInput.children[0];
                        secondInput = ifInput.children[2];

                        if (firstInput && firstInput.selector
                            && firstInput.selector == 'reportGetVar'
                            && secondInput && secondInput.selector
                            && secondInput.selector == 'getLastAnswer') {
                            nop();
                        } else {
                            isGreaterThanCorrect = false;
                        }
                    }
                }
                if (isGreaterThanCorrect) {
                    if (ifBlock.children[2].children[0]
                        && ifBlock.children[2].children[0].blockSequence) {
                        ifBlock.children[2].children[0].blockSequence().forEach(function(block) {
                            if (block.selector == 'doSayFor') {
                                if (block.children[1].children[0].text.indexOf('too big') == -1) {
                                    block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                                    isGreaterThanCorrect = false;
                                    hasHighlight = true;
                                }
                            } else {
                                block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                                isGreaterThanCorrect = false;
                                hasHighlight = true;
                            }
                        });
                    }
                }
                return isGreaterThanCorrect;
            };

            if (!checkLessThan(ifBlock) && !checkGreaterThan(ifBlock)) {
                isIfNotEqualCorrect = false;
            }
            return isIfNotEqualCorrect;
        };

        checkGGIfEquals = function(ifBlock) {
            var ifSubBlockIndexMap = getSubBlockIndexMap(ifBlock.children[2]);
            var isEqualCorrect = true;
            var hasCongrats = false;
            // check say block, highlight unnessary block
            Object.keys(ifSubBlockIndexMap).forEach(function (selector) {
                if (selector.indexOf('doSayFor') == -1) {
                    ifSubBlockIndexMap[selector].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                    isEqualCorrect = false;
                    hasHighlight = true;
                } else {
                    var sayInput = ifSubBlockIndexMap[selector].block.children[1];
                    if (sayInput instanceof ReporterBlockMorph
                        || sayInput.children[0].text.indexOf('Congratulations') == -1) {
                        ifSubBlockIndexMap[selector].block.addSingleHintHighlight(new Color(255, 255, 0, 1));
                        isEqualCorrect = false;
                        hasHighlight = true;
                    } else if (sayInput.children[0].text.indexOf('Congratulations') != -1) {
                        hasCongrats = true;
                    }
                }
            });
            if (!hasCongrats) {
                isEqualCorrect = false;
            }
            return isEqualCorrect;
        };


        checkIfBlock = function(ifBlock) {
            var ifInput = ifBlock.children[1];
            if (ifInput && ifInput.selector) {
                if (ifInput.selector == 'reportLessThan'
                    || ifInput.selector == 'reportGreaterThan') {
                    if(!checkGGIfNotEqual(ifBlock)) {
                        return false;
                    }
                } else if (ifInput.selector == 'reportEquals') {
                    if(!checkGGIfEquals(ifBlock)) {
                        return false;
                    }
                }
            }
            return true;
        };

        if (doUntilIndexMap['doIf']) {
            ifBlock = doUntilIndexMap['doIf'].block;
            if (!checkIfBlock(ifBlock)) {
                isFeedbackCorrect = false;
            }
        }
        if (doUntilIndexMap['doIf1']) {
            ifBlock = doUntilIndexMap['doIf1'].block;
            if (!checkIfBlock(ifBlock)) {
                isFeedbackCorrect = false;
            }
        }
        if (doUntilIndexMap['doIf2']) {
            ifBlock = doUntilIndexMap['doIf2'].block;
            if (!checkIfBlock(ifBlock)) {
                isFeedbackCorrect = false;
            }
        }

        if (!doUntilIndexMap['doAsk']
            || !doUntilIndexMap['doIf']
            || !doUntilIndexMap['doIf1']
            || !doUntilIndexMap['doIf2']) {
            isFeedbackCorrect = false;
        }
    }

    return isFeedbackCorrect;
};

checkGGOne = function(sprite) {
    scripts = sprite.scripts;
    isCorrect = true;

    var firstCheckBlocks = scripts.allChildren().filter(function(block) {
        if (block.selector) {
            return (block.selector == 'receiveGo'
                || block.selector == 'doSayFor'
                || block.selector == 'reportJoinWords'
                || block.selector == 'doSetVar'
                || block.selector == 'doUntil'
                || block.selector == 'reportEquals'
                || block.selector == 'reportLessThan'
                || block.selector == 'reportGreaterThan'
                || block.selector == 'doIf');
        }
    });

    // Get go block
    var hatBlock = firstCheckBlocks.filter(function(block) {
        return block instanceof HatBlockMorph;
    });
    if (hatBlock) {
        hatBlock = hatBlock[0];
    }

    var nonCommentChildren = scripts.children;
    if (nonCommentChildren.length > 1) {
        isCorrect = false;
        for (var i = 0; i < nonCommentChildren.length; i++) {
            if (!(nonCommentChildren[i] instanceof HatBlockMorph)
                &&  nonCommentChildren[i].getHintHighlight() == null) {
                nonCommentChildren[i].addHintHighlight(new Color(255, 255, 0, 1));
                hasHighlight = true;
            }
        }
        if (nonCommentChildren.length == 2
            && sprite.parsonsProblemPalette.contents.children.length == 0
        ) {
            popupDialogBox(' Please put all blocks under the hat block ');
        }
    }

    if (hatBlock) {
        var nextBlock = hatBlock.nextBlock();
        var blockIndexMap = {};
        var blockIndex = 0;
        while (nextBlock) {
            removeChildrenHighLight(nextBlock);
            if (nextBlock.selector) {
                if (blockIndexMap[nextBlock.selector]) {
                    id = blockIndexMap[nextBlock.selector].nextId;
                    nextId = id + 1;
                    blockIndexMap[nextBlock.selector].nextId = nextId;
                    blockIndexMap[nextBlock.selector + id] =
                        {index: blockIndex, block: nextBlock, id: nextId};
                } else {
                    // The first one of nextId stores the length of blocks with the same selector
                    blockIndexMap[nextBlock.selector] =
                        {index: blockIndex, block: nextBlock, nextId: 1};
                }
                blockIndex++;
            }
            nextBlock = nextBlock.nextBlock();
        }

        console.log(blockIndexMap);
        // Check greeting users and set secret number
        if (!checkGreetingAndSetRandom(blockIndexMap)) {
            isCorrect = false;
        }

        // Check guessing feedback inside repeat until
        if (!checkGuessFeedback(blockIndexMap)) {
            isCorrect = false;
        }

        checkGGInputs(firstCheckBlocks);
    }

    if (sprite.parsonsProblemPalette.contents.children.length > 0) {
        isCorrect = false;
    }
    return isCorrect;
};

////////////////////////////////////////////////////////////////////////
// Load Parsons problems ///////////////////////////////////////////////
// Load Parsons problems ///////////////////////////////////////////////
// Load Parsons problems ///////////////////////////////////////////////
// Load Parsons problems ///////////////////////////////////////////////
// Load Parsons problems ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// alpha value for disable editing covering
var COVER_ALPHA = 0.2;
var runCodeTimes = 0;

var hasShowCheckMyWork = false;

// Requires students to run their code for at least this time before
// enabling the help feature.
var RUN_TIMES_TO_ENABLE_HELP = 3;

SnapSerializer.prototype.openProject = function (project, ide) {
    var stage = ide.stage,
        sprites = [],
        sprite;
    if (!project || !project.stage) {
        return;
    }
    ide.projectName = project.name;
    ide.projectNotes = project.notes || '';
    ide.setProjectData(project.data || '');
    if (ide.globalVariables) {
        ide.globalVariables = project.globalVariables;
    }
    if (stage) {
        stage.destroy();
    }
    ide.add(project.stage);
    ide.stage = project.stage;
    sprites = ide.stage.children.filter(function (child) {
        return child instanceof SpriteMorph;
    });
    sprites.sort(function (x, y) {
        return x.idx - y.idx;
    });

    ide.sprites = new List(sprites);
    sprite = sprites[0] || project.stage;

    if (sizeOf(this.mediaDict) > 0) {
        ide.hasChangedMedia = false;
        this.mediaDict = {};
    } else {
        ide.hasChangedMedia = true;
    }
    project.stage.drawNew();
    ide.createCorral();
    ide.selectSprite(sprite);
    ide.fixLayout();

    // force watchers to update
    //project.stage.watchers().forEach(function (watcher) {
    //  watcher.onNextStep = function () {this.currentValue = null;};
    //})

    ide.world().keyboardReceiver = project.stage;
};

function onWorldLoaded() {
    console.log("onWorldLoadedin parsons problem");
    console.log('onworldloaded');
    var ide = world.children[0];
    console.log("ide: ", ide);
    ppxml_path = gon.ppxmlfile_path;
    console.log("ppxml_path: ", ppxml_path);
    function addText(text, fontSize, bold, environment) {
        var width = ide.width();

        var textMorph = new TextMorph(text, fontSize,
            null, bold, false, 'left', width);
        environment.add(textMorph);

        textMorph.drawNew();
        return textMorph;
    }
    showParsonsProblem = function () {
        // console.log('Show example');

        // Disable keyboard
        ScriptsMorph.prototype.enableKeyboard = false;

        //disable clean up
        ScriptsMorph.prototype.userMenu = function () {
        };


        //disable updating custom block
        PrototypeHatBlockMorph.prototype.mouseClickLeft = nop;
        PrototypeHatBlockMorph.prototype.userMenu = nop;
        extend(PrototypeHatBlockMorph, 'init', function (base, definition) {
            base.call(this, definition);
            var cover = new Morph();
            cover.color = new Color(0, 0, 0, COVER_ALPHA);
            cover.setPosition(this.position());
            cover.setExtent(this.extent());
            this.cover = cover;
            this.add(cover);
        });
        //disable editing
        CustomCommandBlockMorph.prototype.userMenu = nop;
        BlockLabelFragmentMorph.prototype.mouseClickLeft = nop;
        BlockLabelPlaceHolderMorph.prototype.mouseClickLeft = nop;
        BlockDialogMorph.prototype.openForChange = nop;

        // only show OK and Apply button in custom block
        extend(BlockEditorMorph, 'fixLayout', function (base) {
            if (this.buttons && (this.buttons.children.length > 0)) {
                this.buttons.children.splice(2, 1);
            }
            base.call(this);
        });


        // Overwrite openProjectString() to show correct message
        ide.openProjectString = function (str) {
            Trace.log('PP.openProjectString');
            var msg,
                myself = this;
            this.nextSteps([
                function () {
                    // msg = myself.showMessage('Opening problem... this may take 2 ~ 5s');
                },
                function () {
                    nop();
                }, // yield (bug in Chrome)
                function () {
                    myself.rawOpenProjectString(str);
                    spriteToLeft(myself);
                    // myself.toggleFastTracking(); // open turbo mode
                },
                function () {
                    Trace.log('PP.Start', null, true, true);
                    msg.destroy();
                }
            ]);
        };

        extendObject(ide, 'rawOpenProjectString', function (base, str) {
            // Attach the comment to loaded code
            base.call(this, str);
            Trace.log('PP.rawOpenProjectString');
            // console.log(this.currentSprite.scripts);

            // clear pentrials
            ide.currentSprite.clear();
            ide.currentSprite.heading = 90;
            ide.currentSprite.changed();
            ide.currentSprite.drawNew();

            ide.corral.children[1].children[0].children.forEach(function (child) {
                // disable deleting sprite
                if (child instanceof SpriteIconMorph) {
                    child.userMenu = function () {
                    };
                }
            });
            //refresh palette
            this.flushPaletteCache();
            this.refreshPalette();

            // disable editing for sprites
            ide.sprites.contents.forEach(function (sprite) {
                // clear pentrials
                sprite.clear();
                sprite.heading = 90;
                sprite.changed();
                sprite.drawNew();

                // sprite.isDraggable = false;
                sprite.userMenu = nop;
                sprite.mouseClickLeft = nop;
                sprite.mouseDownLeft = nop;
                sprite.mouseDoubleClick = nop;
                // record original position
                sprite.originalX = sprite.xPosition();
                sprite.originalY = sprite.yPosition();

                // Get all the example code
                var exampleCode = [];
                if (sprite.scripts.children.length > 0) {
                    sprite.scripts.cleanUp();
                    sprite.scripts.children.forEach(function (script) {
                        exampleCode.push(script);
                    });
                }
                sprite.exampleCode = exampleCode;

                // Create palette for preseting parsons problems blocks
                // create parsons problems palette for this sprite
                parsonsProblemPalette = createParsonsProblemPalette(sprite, ide);

                // Put parsons problem code into palette:
                addCodeToPalette(sprite);
                parsonsProblemPalette.originalBlockLength = parsonsProblemPalette.contents.children.length;
            });
            ide.stage.userMenu = nop;
            ide.spriteBar.tabBar.hide();

            // avoid duplicating existing blocks
            extend(SpriteIconMorph, 'reactToDropOf', function (base, morph, hand) {
                morph.slideBackTo(hand.grabOrigin);
            });
            // Sprite icon
            ide.corral.frame.contents.children.forEach(function (spriteIcon) {
                spriteIcon.isDraggable = false;
            });

            // Change IDE color
            ide.color = new Color(50, 50, 90);
            ide.controlBar.color = new Color(150, 150, 190);
            ide.controlBar.drawNew();
            ide.controlBar.fixLayout();

            // disable function for adding new sprite
            ide.corralBar.children[0].hide();
            ide.corralBar.children[1].hide();
            ide.corralBar.children[2].hide();
            // hide stage morph
            ide.corral.stageIcon.hide();
            ide.corral.stageIcon.isDraggable = false;


            // hide original palette
            ide.palette.hide();


            ide.palette = ide.currentSprite.parsonsProblemPalette;
            ide.palette.show();
            // avoid the palette being deleted
            ide.createPalette = nop;
            ide.createCategories = nop;
            ide.createCorralBar = nop;

            //disable costumes and sounds
            ide.importMedia = function () {
                this.inform(
                    'Feature Disabled',
                    'Sorry, this feature is disabled in this assignment!'
                );
            };

            ide.languageMenu = function () {
                this.inform(
                    'Feature Disabled',
                    'Sorry, this feature is disabled in this assignment!'
                );
            };
            // TODO: Fix zoom blocks
            ide.setBlocksScale = function (num) {
                Trace.log('PP.zoomBlocks');
                SyntaxElementMorph.prototype.setScale(num);
                CommentMorph.prototype.refreshScale();
                SpriteMorph.prototype.initBlocks();
                this.fixLayout();
                this.refreshIDE();
                this.saveSetting('zoom', num);
            };

            // TODO: Fix (flatDesign) flatDesign
            ide.refreshIDE = function () {
                Trace.log('PP.refreshIDE');
                // changeSize = function() {
                //     ide.openProjectString(str);
                // };
                // ide.confirm(
                //     'Your progress will be lost!',
                //     'Are you sure to do this?',
                //     changeSize);
                canReset = true;
                this.sprites.contents.forEach(function (sprite) {
                    if (sprite.parsonsProblemPalette.contents.children.length != sprite.parsonsProblemPalette.originalBlockLength) {
                        canReset = false;
                    }
                });
                if (canReset) {
                    ide.openProjectString(str);
                } else {
                    ide.inform(
                        'Feature Disabled',
                        'Sorry, this feature is disabled in this assignment!'
                    );
                }
            };

            // Disable import button and shift click function
            ide.projectMenu = function () {
                Trace.log('PP.projectMenu');
                var menu,
                    myself = this,
                    world = this.world(),
                    pos = this.controlBar.projectButton.bottomLeft(),
                    graphicsName = this.currentSprite instanceof SpriteMorph ?
                        'Costumes' : 'Backgrounds',
                    shiftClicked = (world.currentKey === 16);

                menu = new MenuMorph(this);
                menu.addItem('Project notes...', 'editProjectNotes');
                menu.addLine();
                menu.addPair('New', 'createNewProject', '^N');
                menu.addPair('Save', "save", '^S');
                menu.addItem('Save As...', 'saveProjectsBrowser');
                menu.addLine();
                menu.addItem(
                    'Import...',
                    function () {
                        Trace.log('PP.importProject');
                        world.inform('This feature is disabled.');
                    },
                    'file menu import hint' // looks up the actual text in the translator
                );


                menu.addItem(
                    shiftClicked ?
                        'Export project as plain text...' : 'Export project...',
                    function () {
                        if (myself.projectName) {
                            myself.exportProject(myself.projectName, shiftClicked);
                        } else {
                            myself.prompt('Export Project As...', function (name) {
                                myself.exportProject(name, shiftClicked);
                            }, null, 'exportProject');
                        }
                    },
                    'save project data as XML\nto your downloads folder',
                    shiftClicked ? new Color(100, 0, 0) : null
                );

                if (this.stage.globalBlocks.length) {
                    menu.addItem(
                        'Export blocks...',
                        function () {
                            myself.exportGlobalBlocks();
                        },
                        'show global custom block definitions as XML' +
                        '\nin a new browser window'
                    );
                    menu.addItem(
                        'Unused blocks...',
                        function () {
                            myself.removeUnusedBlocks();
                        },
                        'find unused global custom blocks' +
                        '\nand remove their definitions'
                    );
                }

                menu.addItem(
                    'Export summary...',
                    function () {
                        myself.exportProjectSummary();
                    },
                    'open a new browser browser window\n with a summary of this project'
                );

                menu.popup(world, pos);
            };

            // ide.droppedText = function (aString, name) {
            //     Trace.log('PP.droppedText');
            //     this.inform('Feature Disabled', 'This feature is disabled in lab assignments.');
            // };

            // remove highlight for blocks which already has value
            extend(ScriptsMorph, 'showReporterDropFeedbackFromTarget', function (base, block, target) {
                if (target != null && target.contents != null) {
                    if (target.contents().text != null &&
                        target.contents().text.length != 0 &&
                        target.cover) {
                        return null;
                    }
                }
                if (target instanceof MultiArgMorph) {
                    // avoid changging 'join' block in guessing game
                    return null;
                }
                base.call(this, block, target);
                // HACK: figure out why original code differentiate this with MultiArgMorph
                // this.feedbackMorph.color = new Color(0, 255, 0);
                // this.feedbackMorph.borderColor = new Color(0, 255, 0);
                // this.feedbackMorph.color.a = 0.5;
                // this.feedbackMorph.drawNew();
                // this.feedbackMorph.changed();
            });

            //
            // if (ide.info == null) {
            //     infoMorph = new Morph();
            //     info = addText(
            //         'Use all available blocks \n to solve this problem', 14, true, infoMorph);
            //     info.color = ide.buttonLabelColor;
            //     info.drawNew();
            //     info.setExtent(ide.categories.extent());
            //     info.setPosition(ide.categories.position().add(
            //         new Point(10,
            //             ide.categories.height() / 2 - info.height() / 2)));
            //     ide.info = info;
            //     ide.add(info);
            // }

            // Create simple instructions for parsons problems
            ide.categories.hide();

            // add hat block
            if (window.assignmentID != 'pong1Lab') {
                if (window.assignmentID != 'polygonMakerLab') {
                    var hatBlock = ide.currentSprite.blockForSelector('receiveGo', true);
                    hatBlock.isTemplate = false;
                    hatBlock.isDraggable = true;
                    // Add default hat block, set position
                    hatBlock.setPosition(
                        new Point(ide.spriteEditor.left() + 10,
                            ide.spriteEditor.top() + hatBlock.extent().y));

                    hatBlock.userMenu = showBlockUserMenu;
                    // ide.currentSprite.scripts.add(hatBlock);
                }


                extendObject(ide, 'selectSprite', function (base, sprite) {
                    base.call(this, sprite);
                    ide.spriteBar.tabBar.hide();
                });

            };
            ide.fixLayout();


            ide.newProject = function () {
                Trace.log('PP.newProject');
                ide.rawOpenProjectString(str);
                // TODO(rzhi): Fix new project
            };

            // demand students to name the project
            ide.projectName = null;

            // hide 'Check My Work' button; hope students will test their code first
            if (window.assignmentID !== 'demo') {
                ide.controlBar.PPHelpButton.hide();
            }
        }); //rawOpenProjectString

        extend(BlockMorph, 'prepareToBeGrabbed', function (base, hand) {
            // if (this.getHintHighlight()) {
            //     this.removeHintHighlight();
            // }
            removeHighLight(this);
            base.call(this, hand);
        });

        extendObject(ide, 'runScripts', function (base) {
            base.call(this);
            runCodeTimes++;
            informHelpFeature();
        });

        extend(BlockMorph, 'mouseClickLeft', function (base) {
            runCodeTimes++;
            informHelpFeature();
            // Avoid multiple running scripts
            ide.stopAllScripts();

            removeHighLight(this);

            base.call(this);

            if (this.isTemplate) {
                return;
            }
        });
        ide.fixLayout();
    };
    if (ppxml_path) {
        console.log('find ppxmlpath');
        console.log('ppxmlfilepath: ', ppxml_path);
        $.get(
            ppxml_path,
            // gon.ppxml_file
            function (data) {
                showParsonsProblem();
                ide.droppedText(data);
                // ide.palette.hide();
            }
        );
        // ).done(spriteToLeft(ide));
        // }

// onWorldLoaded: 这时页面已经加载好，ide有了，ide.corral对应的是已经加载好的corral，所以
// corral的height 和 width也固定了。

        // window.assignmentID = getSearchParameters()['assignment'];


        function spriteToLeft(ide) {
            console.log('spritetoleft!');
            infoMorph = new Morph();

// For adding text in an environment

            // info = addText(
            //     'Use all available blocks \n to solve this problem', 14, true, infoMorph);
            // info.color = ide.buttonLabelColor;
            // info.drawNew();
            // info.setExtent(ide.categories.extent());
            // info.setPosition(ide.categories.position().add(
            //     new Point(10,
            //         ide.categories.height() / 2 - info.height() / 2)));
            // ide.info = info;
            // ide.add(info);


            console.log('ide: ', ide);
            // Store
            sessionStorage.setItem("idepalette", ide.palette);

            console.log('sprteToLeft, ide hide runned');
            console.log('ide.sprites.contents[0].scripts', ide.sprites.contents[0].scripts);
            sprite = getSprite(0);
            console.log('sprite: ', sprite);
            console.log('scriptsonscreen: ', getScripts(0));
            sprite.clear();
            sprite.heading = 90;
            sprite.changed();
            sprite.drawNew();

            // sprite.isDraggable = false;
            sprite.userMenu = nop;
            sprite.mouseClickLeft = nop;
            sprite.mouseDownLeft = nop;
            sprite.mouseDoubleClick = nop;
            // record original position
            sprite.originalX = sprite.xPosition();
            sprite.originalY = sprite.yPosition();

            // Get all the example code
            var exampleCode = [];
            if (sprite.scripts.children.length > 0) {
                sprite.scripts.cleanUp();
                sprite.scripts.children.forEach(function (script) {
                    exampleCode.push(script);
                });
            }
            sprite.exampleCode = exampleCode;
            console.log("sprite.examplecode: ", sprite.exampleCode);
            // Create palette for preseting parsons problems blocks
            // create parsons problems palette for this sprite
            parsonsProblemPalette = createParsonsProblemPalette(sprite, ide);

            // Put parsons problem code into palette:
            addCodeToPalette(sprite);
            parsonsProblemPalette.originalBlockLength = parsonsProblemPalette.contents.children.length;

        }


        // Notify user about using all blocks if check the same blocks
        var CHECK_SAME_COUNT = 0;
        var previousCodeLength = 0;

        if (window.assignmentID == 'demo') {
            RUN_TIMES_TO_ENABLE_HELP = 1;
        }

        // Add help feature
        PPHelpButton = addButton(ide, 'Check My Work', function () {
            checkMyWork = function () {
                var isCorrect = true;
                hasHighlight = false;
                Trace.log('PP.checkMyWork');
                if (window.assignmentID == 'demo') {
                    isCorrect = checkDemo(ide.currentSprite);
                } else if (window.assignmentID == 'polygonMakerLab') {
                    isCorrect = checkPolygonMaker(ide.currentSprite);
                } else if (window.assignmentID == 'pong1Lab') {
                    isCorrect = checkPongOne(ide.sprites.contents,
                        ide.currentSprite);
                } else if (window.assignmentID == 'guess1Lab') {
                    isCorrect = checkGGOne(ide.currentSprite);
                }
                paletteContentLength = ide.currentSprite.parsonsProblemPalette.contents.children.length;
                if (paletteContentLength > 0) {
                    if (paletteContentLength == ide.currentSprite.parsonsProblemPalette.originalBlockLength) {
                        popupDialogBox(' Please use all blocks from the palette to solve the problem ');
                    } else {
                        currentCodeLength = ide.currentSprite.scripts.allChildren().length;
                        currentCodeLength = currentCodeLength + ide.currentSprite.scripts.children.length;
                        if (currentCodeLength == previousCodeLength) {
                            CHECK_SAME_COUNT++;
                        } else {
                            CHECK_SAME_COUNT = 0;
                            previousCodeLength = currentCodeLength;
                        }
                        if (CHECK_SAME_COUNT >= 2 || !hasHighlight) {
                            popupDialogBox(' Please use all blocks from the palette to solve the problem ');
                        }
                    }
                    isCorrect = false;
                }
                // If all correct, then popup to suggest submit assignment
                if (isCorrect) {
                    Trace.log('PP.correctSolution');
                    submitAssignment = function () {
                        if (BlockEditorMorph.showing &&
                            BlockEditorMorph.showing[0]) {
                            BlockEditorMorph.showing[0].updateDefinition();
                        }
                        // TODO: fix bug for keyboard focus
                        if (ide.projectName) {
                            ide.exportProject(ide.projectName, false, false);
                        } else {
                            ide.prompt('Export Project As...', function (name) {
                                // no shift clicked
                                ide.exportProject(name, false);
                            }, null, 'exportProject');
                        }
                        Trace.log('IDE.submitAssignment');
                        CodeTrace.log('IDE.submitAssignment', ide.projectName, true, true);
                    };
                    ide.confirm(
                        'Your solution is correct! Click Yes to submit your solution and download a local copy.',
                        'Congratulations',
                        submitAssignment);
                } else {
                    // Only show the instruction if the user first uses this feature
                    if (isFirstCheck && hasHighlight) {
                        if (!isDialogShowing) {
                            isFirstCheck = false;
                        }
                        popupDialogBox(' Yellow highlighted blocks are misplaced ');
                    }
                }
            };
            checkMyWork();
        });
        ide.controlBar.add(PPHelpButton);
        ide.controlBar.PPHelpButton = PPHelpButton;

        // Reset the sprite to the original solution
        resetButton = addButton(ide, 'Reset Sprite & Clear Stage', function () {
            Trace.log('PP.resetSprite');
            // reset sprite
            // Avoid multiple running scripts
            // Copied from IDE_Morph.prototype.stopAllScripts
            if (ide.stage.enableCustomHatBlocks) {
                ide.stage.threads.pauseCustomHatBlocks =
                    !ide.stage.threads.pauseCustomHatBlocks;
            } else {
                ide.stage.threads.pauseCustomHatBlocks = false;
            }
            ide.controlBar.stopButton.refresh();
            ide.stage.fireStopAllEvent();

            ide.sprites.contents.forEach(function (sprite) {
                // // move to original position
                sprite.setXPosition(sprite.originalX);

                sprite.setYPosition(sprite.originalY);

                // clear pentrails
                sprite.clear();
                sprite.heading = 90;
                sprite.changed();
                sprite.drawNew();
            });
        });
        ide.corralBar.add(resetButton);
        ide.corralBar.resetButton = resetButton;


        extendObject(ide, 'fixLayout', function (base, situation) {
            base.call(this, situation);
            var PPHelpButton = this.controlBar.PPHelpButton;
            if (PPHelpButton) {
                PPHelpButton.setPosition(new Point(
                    this.stage.left() - PPHelpButton.width() / 2 - 165,
                    PPHelpButton.top()));
            }
            var resetButton = this.corralBar.resetButton;
            if (resetButton) {
                resetButton.setPosition(new Point(
                    this.corral.left() + this.corral.extent().x / 2 - resetButton.width() / 2,
                    this.stage.bottom()));
            }
        });

        // Fix issues for toggleAppMode
        extendObject(ide, 'toggleAppMode', function (base, appMode) {
            base.call(this, appMode);
            Trace.log('PP.toggleAppMode');
            ide.categories.hide();
            // disable function for adding new sprite
            ide.corralBar.children[0].hide();
            ide.corralBar.children[1].hide();
            ide.corralBar.children[2].hide();
            ide.children[2].hide();
            // hide stage morph
            ide.corral.stageIcon.hide();

            // hide 'scripts/costumes/sounds'
            ide.spriteBar.tabBar.hide();
            // hide info
            if (ide.info) {
                if (this.isAppMode) {
                    ide.info.hide();
                } else {
                    ide.info.show();
                }
            }
        });


        // console.log('Parsons problem: ' + window.assignmentID);

        // show the example for certain users



        // showParsonsProblem();


    }
    ;
};




removeHighLight = function(block) {
    nextBlock = block;
    while (nextBlock) {
        if (nextBlock.getHintHighlight &&
            nextBlock.getHintHighlight()) {
            nextBlock.removeHintHighlight();
        }
        removeChildrenHighLight(nextBlock);
        if (nextBlock.nextBlock) {
            nextBlock = nextBlock.nextBlock();
        } else{
            break;
        }
    }
};

removeChildrenHighLight = function (block) {
    block.allChildren().forEach(function(subBlock){
        if (subBlock.getHintHighlight &&
            subBlock.getHintHighlight()) {
            subBlock.removeHintHighlight();
        }
    });
};

disableBlockEdit = function(block) {
    if (block instanceof CommandBlockMorph ||
        block instanceof ReporterBlockMorph ||
        block instanceof HatBlockMorph ||
        block instanceof CSlotMorph ||
        block instanceof BlockMorph ||
        block instanceof PrototypeHatBlockMorph ||
        block instanceof CustomCommandBlockMorph) {
        // TODO(rzhi): need to think about custom block
        if (block instanceof CustomCommandBlockMorph ||
            block instanceof CustomReporterBlockMorph ||
            block instanceof PrototypeHatBlockMorph) {
            block.mouseClickLeft = function() {};
            //disable clicking to show customblock
            block.userMenu = showEditMenu;
        } else {
            block.userMenu = showBlockUserMenu;
        }
    }
    if (block instanceof InputSlotMorph) {
        if (block.contents().text.length == 0) {
            block.contents().edit = nop;
            block.contents().mouseClickLeft = nop;
            block.contents().mouseDownLeft = nop;
            block.contents().enableSelecting = nop;
            return;
        }

        // grey out and bolden the non-editable element
        if (block.contents().color.r  == 0 &&
            block.contents().color.g  == 0 &&
            block.contents().color.b  == 0
        ) {
            block.contents().color = new Color(125, 125, 125, 1);
            block.contents().isBold = true;
            block.contents().changed();
            block.contents().drawNew();
            block.contents().changed();
        }


        var cover = new Morph();
        cover.color = new Color(0, 0, 0, COVER_ALPHA);
        cover.setPosition(block.position());
        cover.setExtent(block.extent());
        block.cover = cover;

        block.add(cover);
        block.mouseClickLeft = nop;
        block.mouseDownLeft = nop;

        // disable dragging variable in the block, allow editing for blocks with multiple inputs
        extendObject(block.parent, 'replaceInput', function(base, oldArg, newArg) {
            if (oldArg != null && oldArg.contents != null) {
                if (oldArg.contents().text != null && oldArg.contents().text.length != 0) {
                    return null;
                }
            }
            base.call(this, oldArg, newArg);
        });
    }
};

informHelpFeature = function() {
    // if (runCodeTimes >= RUN_TIMES_TO_ENABLE_HELP && !hasShowCheckMyWork) {
    //     // ide.controlBar.PPHelpButton.show();
    //     helpDialog = new DialogBoxMorph();
    //     helpDialog.inform('Help Available',
    //         'You can click \'Check My Work\' if you need help',
    //         ide.world());
    //     helpDialog.setPosition(
    //         ide.controlBar.PPHelpButton.position().
    //         add(new Point(0, ide.controlBar.height() + 6)));
    //     hasShowCheckMyWork = true;
    // }
};

getTopBlock = function(scripts) {
    var topBlock;
    var maxLength = 0;

    scripts.children.filter(function(block) {
        return block instanceof BlockMorph;
    }).forEach(function(block) {
        if(block.allChildren().length > maxLength) {
            maxLength = block.allChildren().length;
            topBlock = block.topBlock();
        }
    });
    return topBlock;
};


addOriginalBlock = function(sprite, topBlock, newBlock) {
    // Add default hat block, set position
    newBlock.setPosition(
        new Point(topBlock.left(), topBlock.top() + newBlock.extent().y));

    // Avoid user deleting or duplicating the WE block
    // Adapted from BlockMorph.prototype.userMenu
    sprite.scripts.add(newBlock);
    newBlock.snap(topBlock);

    //clear drop informatino
    sprite.scripts.clearDropInfo();
    sprite.scripts.dropRecord = null;
    sprite.scripts.recordDrop();
    return newBlock;
};

showEditMenu = function() {
    var menu = new MenuMorph(this);
    menu.addItem('edit...', 'edit');
    return menu;
};

showBlockUserMenu = function() {
    var menu = new MenuMorph(this);
    menu.addItem(
        "help...",
        'showHelp'
    );
    return menu;
};

createParsonsProblemPalette = function(sprite, ide) {
    var parsonsProblemPalette = new ScrollFrameMorph(
        null,
        null,
        sprite.sliderColor
    );
    parsonsProblemPalette.color = SpriteMorph.prototype.paletteColor;
    parsonsProblemPalette.padding = 4;
    parsonsProblemPalette.isDraggable = false;
    parsonsProblemPalette.acceptsDrops = false;
    parsonsProblemPalette.enableAutoScrolling = false;
    // avoid blocks for being deleted
    parsonsProblemPalette.contents.acceptsDrops = false;
    parsonsProblemPalette.setWidth(ide.logo.width());
    sprite.parsonsProblemPalette = parsonsProblemPalette;
    ide.add(parsonsProblemPalette);
    parsonsProblemPalette.hide();
    return parsonsProblemPalette;
};

addCodeToPalette = function(sprite) {
    var unit = SyntaxElementMorph.prototype.fontSize;
    var paletteYPosition = sprite.parsonsProblemPalette.top() + unit;
    sprite.exampleCode.forEach(function(block, index) {
    palette_start_index = parseInt(document.getElementById("minitask_palette_start_index").innerHTML)
        if (index < palette_start_index) {
            if (block instanceof CommentMorph) return;
            //block instanceof CustomCommandBlockMorph
            block.nextBlock().userMenu = showEditMenu;
            block.isDraggable = false;
            block.nextBlock().isDraggable = false;
            // block.isStatic = true;
            // block.nextBlock().isStatic = true;
            block.isStop = function() {
                return true;
            };
            // block.nextBlock().isStop = function() {
            //     return true;
            // };
            var allow_repeat = parseInt(document.getElementById("minitask_allow_repeat").innerHTML);
            if (allow_repeat===1){
                block.blockSequence().forEach(function (insideblock) {
                    console.log("insideblock: ", insideblock);
                    console.log("insideblock.text: ", insideblock.selector);

                        if (insideblock.selector !== "doRepeat") {
                            insideblock.children.forEach(function (subMorph){
                                console.log("subMorph.text: ", subMorph.selector);
                                disableBlockEdit(subMorph);
                            });

                        }
                        else if (insideblock.children[2]){
                            insideblock.children[2].allChildren().forEach(function (subMorph){
                                console.log("subMorph.text: ", subMorph.selector);
                                disableBlockEdit(subMorph);
                            });
                        }
                    });
            }
            else{
                block.allChildren().forEach(function (subMorph){
                    console.log("subMorph.text: ", subMorph.selector);
                    disableBlockEdit(subMorph);
                });
            }

            if (block instanceof HatBlockMorph) {
                block.userMenu = showBlockUserMenu;
            }
            return;
        }
        paletteYPosition += unit * 0.8;
        block.allChildren().forEach(function (subMorph) {
            disableBlockEdit(subMorph);
        });
        disableBlockEdit(block);

        // set default value for testing
        if (window.assignmentID == 'polygonMakerLab' ) {
            setDefaultInputForPolygonMaker(block);
        } else if (window.assignmentID == 'demo' ) {
            setDefaultInputForDemo(block);
        }

        if (window.assignmentID == 'pong1Lab' && index == 0) {
            // Let the first block remains on the script editor
            paletteYPosition = sprite.parsonsProblemPalette.top() + unit;
            return;
        }

        // disable left/right arrow for guessing game
        if (window.assignmentID == 'guess1Lab') {
            if (block.selector == 'reportJoinWords') {
                block.children[1].addInput = nop;
                block.children[1].removeInput = nop;

                extendObject(block.children[1], 'drawNew', function(base) {
                    base.call(this);
                    this.arrows().children.forEach(function(arrow){
                        arrow.hide();
                    });
                });
                block.children[1].drawNew();
            }
        }

        block.setPosition(new Point(4, paletteYPosition));
        sprite.parsonsProblemPalette.addContents(block);
        if (block instanceof CommentMorph) {
            block.align(block.block);
            block.isDraggable = false;
            return;
        }
        paletteYPosition += block.height();
    });
    extend(SyntaxElementMorph, 'revertToDefaultInput',
        function (base, arg, noValues) {
            var idx = this.children.indexOf(arg);
            base.call(this, arg, noValues);
            // Disable editing for replacemented input slot after removing the variable
            deflt = this.children[idx];
            // must check for 'if' or 'repeatuntil' block, otherwise will cause
            // no function issue
            if (deflt && deflt.contents) {
                deflt.contents().edit = nop;
                deflt.contents().mouseClickLeft = nop;
                deflt.contents().mouseDownLeft = nop;
                deflt.contents().enableSelecting = nop;
            }
            // set default value for testing
            if (window.assignmentID == 'polygonMakerLab' ) {
                setDefaultInputForPolygonMaker(this);
            } else if (window.assignmentID == 'demo' ) {
                setDefaultInputForDemo(this);
            }
        });
};



setDefaultInput = function(block, content) {
    block.inputs()[0].contents().setText(content);
    block.inputs()[0].contents().color = new Color(170, 170, 170, 1);
    block.inputs()[0].contents().isBold = true;
    block.inputs()[0].contents().mouseDoubleClick = nop;
    block.inputs()[0].contents().changed();
    block.inputs()[0].contents().drawNew();
    block.inputs()[0].contents().changed();
};

setDefaultInputForPolygonMaker = function(block) {
    if (block.selector == 'forward') {
        setDefaultInput(block, 50);
    } else if (block.selector == 'turn') {
        setDefaultInput(block, 90);
    } else if (block.selector == 'doRepeat') {
        setDefaultInput(block, 4);
    } else if (block.selector == 'setSize') {
        setDefaultInput(block, 1);
    }
};

setDefaultInputForDemo = function(block) {
    if (block.selector == 'forward') {
        setDefaultInput(block, 20);
    }
};