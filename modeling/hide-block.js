//
// IDE_Morph.prototype.rawOpenProjectString = function (str) {
//     this.toggleAppMode(false);
//     this.spriteBar.tabBar.tabTo('scripts');
//     StageMorph.prototype.hiddenPrimitives = {};
//     StageMorph.prototype.codeMappings = {};
//     StageMorph.prototype.codeHeaders = {};
//     StageMorph.prototype.enableCodeMapping = false;
//     StageMorph.prototype.enableInheritance = true;
//     StageMorph.prototype.enableSublistIDs = false;
//     Process.prototype.enableLiveCoding = false;
//     if (Process.prototype.isCatchingErrors) {
//         try {
//             this.serializer.openProject(
//                 this.serializer.load(str, this),
//                 this
//             );
//         } catch (err) {
//             // this.showMessage('Load failed: ' + err);
//             Trace.logError(err);
//         }
//     } else {
//         this.serializer.openProject(
//             this.serializer.load(str, this),
//             this
//         );
//     }
//     this.stopFastTracking();
//
// };
//
//
//
//
// addCodeToPalette = function(sprite) {
//     console.log('addcodetopalette');
//     var unit = SyntaxElementMorph.prototype.fontSize;
//     var paletteYPosition = sprite.parsonsProblemPalette.top() + unit;
//     sprite.exampleCode.forEach(function(block, index) {
//         if (window.assignmentID == 'polygonMakerLab' && index < 6) {
//             if (block instanceof CommentMorph) return;
//             //block instanceof CustomCommandBlockMorph
//             block.nextBlock().userMenu = showEditMenu;
//             block.isDraggable = false;
//             block.nextBlock().isDraggable = false;
//             // block.isStatic = true;
//             // block.nextBlock().isStatic = true;
//             block.isStop = function() {
//                 return true;
//             };
//             // block.nextBlock().isStop = function() {
//             //     return true;
//             // };
//             if (block instanceof HatBlockMorph) {
//                 block.userMenu = showBlockUserMenu;
//             }
//             return;
//         }
//         paletteYPosition += unit * 0.8;
//         block.allChildren().forEach(function (subMorph) {
//             disableBlockEdit(subMorph);
//         });
//         disableBlockEdit(block);
//         console.log('351 line in hideblock');
//
//         // set default value for testing
//         if (window.assignmentID == 'polygonMakerLab' ) {
//             setDefaultInputForPolygonMaker(block);
//         } else if (window.assignmentID == 'demo' ) {
//             setDefaultInputForDemo(block);
//         }
//
//         if (window.assignmentID == 'pong1Lab' && index == 0) {
//             // Let the first block remains on the script editor
//             paletteYPosition = sprite.parsonsProblemPalette.top() + unit;
//             return;
//         }
//
//         // disable left/right arrow for guessing game
//         if (window.assignmentID == 'guess1Lab') {
//             if (block.selector == 'reportJoinWords') {
//                 block.children[1].addInput = nop;
//                 block.children[1].removeInput = nop;
//
//                 extendObject(block.children[1], 'drawNew', function(base) {
//                     base.call(this);
//                     this.arrows().children.forEach(function(arrow){
//                         arrow.hide();
//                     });
//                 });
//                 block.children[1].drawNew();
//             }
//         }
//
//         block.setPosition(new Point(4, paletteYPosition));
//         sprite.parsonsProblemPalette.addContents(block);
//         if (block instanceof CommentMorph) {
//             block.align(block.block);
//             block.isDraggable = false;
//             return;
//         }
//         paletteYPosition += block.height();
//     });
//     extend(SyntaxElementMorph, 'revertToDefaultInput',
//         function (base, arg, noValues) {
//             var idx = this.children.indexOf(arg);
//             base.call(this, arg, noValues);
//             // Disable editing for replacemented input slot after removing the variable
//             deflt = this.children[idx];
//             // must check for 'if' or 'repeatuntil' block, otherwise will cause
//             // no function issue
//             if (deflt && deflt.contents) {
//                 deflt.contents().edit = nop;
//                 deflt.contents().mouseClickLeft = nop;
//                 deflt.contents().mouseDownLeft = nop;
//                 deflt.contents().enableSelecting = nop;
//             }
//             // set default value for testing
//             if (window.assignmentID == 'polygonMakerLab' ) {
//                 setDefaultInputForPolygonMaker(this);
//             } else if (window.assignmentID == 'demo' ) {
//                 setDefaultInputForDemo(this);
//             }
//         });
// };
