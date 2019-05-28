

extendObject(window, 'onWorldLoaded', function(base) {
    base.call(this);
// onWorldLoaded: 这时页面已经加载好，window.ide有了，window.ide.corral对应的是已经加载好的corral，所以
// corral的height 和 width也固定了。


    taskbutton = new PushButtonMorph(
        window,
        "taskButton",
        "Task"
    );
    taskbutton.corner = 12;
    taskbutton.labelMinExtent = new Point(36, 18);
    taskbutton.padding = 0;

    taskbutton.drawNew();
    taskbutton.hint = "task my code";
    taskbutton.fixLayout();
    window.ide.taskbutton = taskbutton;
    window.ide.corral.add(taskbutton);
    window.taskButton = function() {
        window.ide.inform( "Task Description",
            'In this task, please move 10 steps.'

            );
    }


    extendObject(window.ide, 'fixLayout', function(base, situation) {
        base.call(this, situation);

        var taskbutton = this.taskbutton;
        if (taskbutton) {
            taskbutton.setPosition(new Point(
                this.corral.left() + this.corral.width()  - taskbutton.width()-30,
                this.corral.bottom() - taskbutton.height() - 15));
        }
    });

    window.ide.fixLayout();
});



DialogBoxMorph.prototype.askNext = function (
    title,
    textString,
    world,
    pic
) {
    var txt = new TextMorph(
        textString,
        this.fontSize,
        this.fontStyle,
        true,
        false,
        'center',
        null,
        null,
        MorphicPreferences.isFlat ? null : new Point(1, 1),
        new Color(255, 255, 255)
    );

    if (!this.key) {
        this.key = 'decide' + title + textString;
    }

    this.labelString = title;
    this.createLabel();
    if (pic) {this.setPicture(pic); }
    this.addBody(txt);
    this.addButton('nextProblem', 'Next Problem');
    this.addButton('ok', 'Return Home');
    this.addButton('cancel', 'Stay');

    this.fixLayout();
    this.drawNew();
    this.fixLayout();
    this.popUp(world);
};


DialogBoxMorph.prototype.nextProblem = function() {
    window.location.href = '/isnap/snap.html?assignment=none';

};



extendObject(window, 'onWorldLoaded', function(base) {
    endCheck = function(){
        Trace.log('endCheck');
    isCorrect = 0;
    scripts = window.ide.currentSprite.scripts;
    scripts.children.forEach(function(script){
        if (script instanceof CommandBlockMorph
            && script.blockSpec == "move %n steps"){
            isCorrect = 1;
        }
    });


    if (isCorrect) {
        Trace.log('test task, correct');
        function submitAssignment(id, project) {

            var xhr = new XMLHttpRequest();

            xhr.open("PUT", "modeling/users.php?id=" + 25, true);
            xhr.send();


            // TODO: fix bug for keyboard focus
            Trace.log('IDE.submitAssignment');
            window.location.href = 'modeling/home.php';

            // CodeTrace.log('IDE.submitAssignment', ide.projectName, true, true);
        };

        cong = new DialogBoxMorph(null, submitAssignment);

        cong.askNext(
            'Congratulations',
            localize( 'Your solution is correct! Click Next Problem to go to your next problem, or click Return Home to return to home. If you want to stay on this page, click Stay.'),
            window.ide.world()
            );
        }

    else {
        // Only show the instruction if the user first uses this feature
        window.ide.inform('Wrong Answer', "This answer is not yet correct");
    }
    };
    base.call(this);


    endbutton = new PushButtonMorph(
        window,
        "endButton",
        "Finished"
    );
    endbutton.corner = 12;
    endbutton.labelMinExtent = new Point(36, 18);
    endbutton.padding = 0;
    endbutton.labelShadowOffset = new Point(-1, -1);

    endbutton.drawNew();
    endbutton.hint = "task finished";
    endbutton.fixLayout();
    endbutton.setPosition(new Point(
        window.ide.corralBar.left() + window.ide.corralBar.width()  - endbutton.width()-8,
        window.ide.corralBar.bottom() - endbutton.height() - 8));


    window.ide.corralBar.add(endbutton);
    window.endButton = function() {
        endCheck();
    }

});
