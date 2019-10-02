window.onload = function any_function_name() {

    let Application = PIXI.Application,
        loader = PIXI.loader,
        resources = PIXI.loader.resources,
        Sprite = PIXI.Sprite,
        Rectangle = PIXI.Rectangle;

//Create Canvas
    let app = new Application({
            width: 256,         // default: 800
            height: 256,        // default: 600
            antialias: true,    // default: false
            transparent: false, // default: false
            resolution: 1       // default: 1
        }
    );
    app.renderer.backgroundColor = 0x061639;
    autoCanvasResizer(app);

// autoResize the canvas renderer to the size of the browser window.
    function autoCanvasResizer(app) {
        app.renderer.view.style.position = "absolute";
        app.renderer.view.style.display = "block";
        app.renderer.autoResize = true;
        app.renderer.resize(window.innerWidth, window.innerHeight);
    }

//Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);

    const imgMap = 'https://raw.githubusercontent.com/kittykatattack/learningPixi/master/examples/images/screenshots/09.png';
    loader
        .add(imgMap)
        .on("progress", loadProgressHandler)
        .load(setup);

    //place to some OVERLOAD
    function loadProgressHandler(loader, resource) {

        //Display the file `url` currently being loaded
        console.log("loading: " + resource.url);

        //Display the percentage of files currently loaded
        console.log("progress: " + loader.progress + "%");
    }

//This `setup` function will run when the image has loaded
    function setup() {

        const catRectangle = new Rectangle(0, 0, 32, 32);
        const catTexture = new PIXI.Texture(resources[imgMap].texture, catRectangle);
        let cat = new Sprite(catTexture);

        document.onkeydown = checkKey;

        createFloor();

        //Add the cat to the stage
        app.stage.addChild(cat);

        const rocketRectangle = new Rectangle(96, 64, 32, 32);
        const rocketTexture = new PIXI.Texture(resources[imgMap].texture, rocketRectangle);

        let rocket = new Sprite(rocketTexture);
        rocket.x = 132;
        rocket.y = 132;
        app.stage.addChild(rocket);

        const minionRectangle = new Rectangle(96, 32, 32, 32);
        const minionTexture2 = new PIXI.Texture(resources[imgMap].texture, minionRectangle);

        let minion = new Sprite(minionTexture2);
        minion.x = 264;
        minion.y = 264;
        app.stage.addChild(minion);

        //move cat
        function checkKey(e) {

            e = e || window.event;

            if (e.keyCode == '38') {
                cat.y += -32;
            }
            else if (e.keyCode == '40') {
                cat.y += 32;
            }
            else if (e.keyCode == '37') {
                cat.x += -32;
            }
            else if (e.keyCode == '39') {
                cat.x += 32;
            }
            // COLLISION ACTION
            const tigerRectangle = new Rectangle(0, 32, 32, 32);
            const tigerTexture = new PIXI.Texture(resources[imgMap].texture, tigerRectangle);

            if (hitTestRectangle(cat, rocket)) {
                rocket.position.set(Math.floor(Math.random() * (window.innerWidth-32)), Math.floor(Math.random() * (window.innerHeight-32)));
                cat.setTexture(tigerTexture);
                cat.scale.set(2,2)
            } else if (hitTestRectangle(cat, minion) && cat.width === 64) {
                minion.position.set(Math.floor(Math.random() * (window.innerWidth-32)), Math.floor(Math.random() * (window.innerHeight-32)));
                cat.scale.set(1,1)
            } else if (hitTestRectangle(cat, minion) && cat.width === 32) {
                end()
            } else {
                //asd
            }
        }

        function end() {
            alert('GAME OVER!!!');

        }

        function createFloor() {
            const floorRectangle = new Rectangle(32, 160, 32, 32);
            const floorTexture = new PIXI.Texture(resources[imgMap].texture, floorRectangle);
            floorTexture._frame = floorRectangle;

            for (let i = 0; i <= window.innerWidth;) {
                for (let j = 0; j <= window.innerHeight;) {
                    let floor = new Sprite(floorTexture);
                    if (i !== 0) {
                        floor.x = i;
                    }
                    if (j !== 0) {
                        floor.y = j;
                    }
                    app.stage.addChild(floor);
                    j += 32
                } i += 32
            }
        };

        // COLLISION ACTION DETECTOR
        function hitTestRectangle(r1, r2) {

            //Define the variables we'll need to calculate
            let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

            //hit will determine whether there's a collision
            hit = false;

            //Find the center points of each sprite
            r1.centerX = r1.x + r1.width / 2;
            r1.centerY = r1.y + r1.height / 2;
            r2.centerX = r2.x + r2.width / 2;
            r2.centerY = r2.y + r2.height / 2;

            //Find the half-widths and half-heights of each sprite
            r1.halfWidth = r1.width / 2;
            r1.halfHeight = r1.height / 2;
            r2.halfWidth = r2.width / 2;
            r2.halfHeight = r2.height / 2;

            //Calculate the distance vector between the sprites
            vx = r1.centerX - r2.centerX;
            vy = r1.centerY - r2.centerY;

            //Figure out the combined half-widths and half-heights
            combinedHalfWidths = r1.halfWidth + r2.halfWidth;
            combinedHalfHeights = r1.halfHeight + r2.halfHeight;

            //Check for a collision on the x axis
            if (Math.abs(vx) < combinedHalfWidths) {
                //A collision might be occurring. Check for a collision on the y axis
                if (Math.abs(vy) < combinedHalfHeights) {
                    //There's definitely a collision happening
                    hit = true;
                } else {
                    //There's no collision on the y axis
                    hit = false;
                }
            } else {
                //There's no collision on the x axis
                hit = false;
            }
            //`hit` will be either `true` or `false`
            return hit;
        };
    }
};