function onWorldLoaded() {
    console.log("onWorldLoadedin parsons problem");
    console.log('onworldloaded');
    var ide = world.children[0];
    console.log("ide: ", ide);
    starter_path = gon.starter_file_path;
    if (starter_path ) {
        console.log('find starter_path ');
        console.log('starter_path : ', starter_path );
        $.get(
            starter_path ,
            // gon.Fppxml_file
            function (data) {
                ide.droppedText(data);
                // ide.palette.hide();
            }
        );




    }
    ;
};
