extend(IDE_Morph, 'createLogo', function(base) {
    base.call(this);
    this.logo.hide();
});


extend(IDE_Morph, 'createControlBar', function(base) {
    base.call(this);
    this.controlBar.hide();
});



extend(IDE_Morph, 'createCategories', function(base) {
    base.call(this);
    this.categories.hide();
});


extend(IDE_Morph, 'createPalette', function(base, forSearching) {
    base.call(this);
    this.palette.hide();
});


extend(IDE_Morph, 'createCorral', function(base) {
    base.call(this);
    this.corral.hide();
});


extend(IDE_Morph, 'createSpriteBar', function(base) {
    base.call(this);
    this.spriteBar.hide();
});



// extendObject(window, 'onWorldLoaded', function(base) {
//     base.call(this);
// // onWorldLoaded: 这时页面已经加载好，window.ide有了，window.ide.corral对应的是已经加载好的corral，所以
// // corral的height 和 width也固定了。
//
//     extendObject(window.ide, 'fixLayout', function(base, situation) {
//         base.call(this, situation);
//
//         var taskbutton = this.taskbutton;
//         if (taskbutton) {
//             taskbutton.setPosition(new Point(
//                 this.corral.left() + this.corral.width()  - taskbutton.width()-30,
//                 this.corral.bottom() - taskbutton.height() - 15));
//         }
//     });
//
//     // window.ide.fixLayout();
// });


IDE_Morph.prototype.fixLayout = function (situation) {
    // situation is a string, i.e.
    // 'selectSprite' or 'refreshPalette' or 'tabEditor'
    var padding = this.padding,
        maxPaletteWidth;

    Morph.prototype.trackChanges = false;

    if (situation !== 'refreshPalette') {
        // controlBar
        this.controlBar.setPosition(this.logo.topRight());
        this.controlBar.setWidth(this.right() - this.controlBar.left());
        this.controlBar.fixLayout();

        // categories (originally is not commented, goes to up after commenting it out)
        this.categories.setLeft(this.logo.left());
        this.categories.setTop(this.logo.top());
        this.categories.setWidth(this.paletteWidth);
    }

    // palette
    this.palette.setLeft(this.logo.left());
    this.palette.setTop(this.logo.top());
    this.palette.setHeight(this.bottom() - this.palette.top());
    this.palette.setWidth(this.paletteWidth);

    if (situation !== 'refreshPalette') {
        // stage
        // function this.stage.width() {
        //     return this.logo.width()*2;
        // }
        if (this.isEmbedMode) {
            this.stage.setScale(Math.floor(Math.min(
                this.width() / this.stage.dimensions.x,
                this.height() / this.stage.dimensions.y
                ) * 10) / 10);
            console.log(this.width())
            this.embedPlayButton.size = Math.floor(Math.min(
                        this.width(), this.height())) / 3;
            this.embedPlayButton.setWidth(this.embedPlayButton.size);
            this.embedPlayButton.setHeight(this.embedPlayButton.size);

            if (this.embedOverlay) {
                this.embedOverlay.setExtent(this.extent());
            }

            this.stage.setCenter(this.center());
            this.embedPlayButton.setCenter(this.center());
        } else if (this.isAppMode) {
            this.stage.setScale(Math.floor(Math.min(
                (this.width() - padding * 2) / this.stage.dimensions.x,
                (this.height() - this.controlBar.height() * 2 - padding * 2)
                    / this.stage.dimensions.y
            ) * 10) / 10);
            this.stage.setCenter(this.center());
        } else {
            // this.stage.setScale(this.isSmallStage ? this.stageRatio :1);
            // console.log(this.isSmallStage, this.stageRatio);
            this.stage.setScale(Math.floor(Math.min(
                this.logo.width()*2 / this.stage.dimensions.x,
                (this.height() - this.controlBar.height() * 2 - padding * 2)
                / this.stage.dimensions.y
            ) * 10) / 10);
            this.stage.setTop(this.logo.top() + padding);
            this.stage.setRight(this.right());
            maxPaletteWidth = Math.max(
                200,
                this.width() -
                    this.stage.width() -
                    this.spriteBar.tabBar.width() -
                    (this.padding * 2)
            );
            if (this.paletteWidth > maxPaletteWidth) {
                this.paletteWidth = maxPaletteWidth;
                this.fixLayout();
            }
            this.stageHandle.fixLayout();
            this.paletteHandle.fixLayout();
        }

        // spriteBar
        this.spriteBar.setLeft(this.paletteWidth + padding);
        this.spriteBar.setTop(this.logo.bottom() + padding);
        this.spriteBar.setExtent(new Point(
            Math.max(0, this.stage.left() - padding - this.spriteBar.left()),
            this.categories.bottom() - this.spriteBar.top() - padding
        ));
        this.spriteBar.fixLayout();

        // spriteEditor
        if (this.spriteEditor.isVisible) {
            // this.spriteEditor.setPosition(this.spriteBar.bottomLeft());
            this.spriteEditor.setLeft(this.paletteWidth + padding);
            this.spriteEditor.setTop(this.controlBar.top() + padding);
            this.spriteEditor.setExtent(new Point(
                this.spriteBar.width(),
                this.bottom() - this.spriteEditor.top()
            ));
        }

        // corralBar
        this.corralBar.setLeft(this.stage.left());
        this.corralBar.setTop(this.stage.bottom() + padding);
        this.corralBar.setWidth(this.stage.width());

        // corral
        if (!contains(['selectSprite', 'tabEditor'], situation)) {
            this.corral.setPosition(this.corralBar.bottomLeft());
            this.corral.setWidth(this.stage.width());
            this.corral.setHeight(this.bottom() - this.corral.top());
            this.corral.fixLayout();
        }

        // Update the label again after all the resizing
        this.controlBar.updateLabel();
    }

    Morph.prototype.trackChanges = true;
    this.changed();
};
