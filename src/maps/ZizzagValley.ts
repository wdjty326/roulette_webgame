import { getWallPosition } from "../Util";


interface RotatingObstacle {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**  */
const ZIGZAG_VALLEY_CONFIG = (() => {
    const width = 2880;
    const height = 12800;

    // 수직 벽의 높이와 위치 계산
    const wallWidth = 64;
    const wallHeight = height / 5;
    let wallY = 0;
    let leftX = width / 2 - 1024;
    let rightX = width / 2 + 1024;

    const walls = [
        {
            x: leftX,
            y: wallY,
            width: wallWidth,
            height: wallHeight,
            angle: 0
        },
        {
            x: rightX,
            y: 0,
            width: wallWidth,
            height: wallHeight,
            angle: 0
        }
    ];

    const rotatingObstacles: RotatingObstacle[] = [];

    const wellPosition1 = getWallPosition(leftX, wallY, wallWidth, wallHeight, Math.PI / 4);
    const wellPosition2 = getWallPosition(rightX, wallY, wallWidth, wallHeight, Math.PI / 4);

    walls.push({
        ...wellPosition1
    });
    walls.push({
        ...wellPosition2
    });

    const wellPosition3 = getWallPosition(wellPosition1.x, wellPosition1.y, wallWidth, wallHeight, wellPosition1.angle);
    const wellPosition4 = getWallPosition(wellPosition2.x, wellPosition2.y, wallWidth, wallHeight, wellPosition2.angle);

    walls.push({ ...wellPosition3, angle: 0});
    walls.push({ ...wellPosition4, angle: 0});

    const wellPosition5 = getWallPosition(wellPosition3.x, wellPosition3.y, wallWidth, wallHeight, -Math.PI / 4);
    const wellPosition6 = getWallPosition(wellPosition4.x, wellPosition4.y, wallWidth, wallHeight, -Math.PI / 4);

    walls.push({
        ...wellPosition5
    });
    walls.push({
        ...wellPosition6
    });

    const wellPosition7 = getWallPosition(wellPosition5.x, wellPosition5.y, wallWidth, wallHeight, wellPosition5.angle);
    const wellPosition8 = getWallPosition(wellPosition6.x, wellPosition6.y, wallWidth, wallHeight, wellPosition6.angle);

    rotatingObstacles.push({
        x: wellPosition7.x,
        y: wellPosition7.y + wellPosition7.height / 2,
        width: 800,
        height: 64,
    })
    
    rotatingObstacles.push({
        x: wellPosition8.x,
        y: wellPosition8.y + wellPosition8.height / 2,
        width: 800,
        height: 64,
    })
    
    rotatingObstacles.push({
        x: wellPosition7.x + wellPosition8.x / 2,
        y: wellPosition8.y + wellPosition8.height / 2,
        width: 800,
        height: 64,
    })
    
    rotatingObstacles.push({
        x: wellPosition8.x - wellPosition8.x / 2,
        y: wellPosition8.y + wellPosition8.height / 2,
        width: 800,
        height: 64,
    })
    
    walls.push({ ...wellPosition7, angle: 0});
    walls.push({ ...wellPosition8, angle: 0});

    const wellPosition9 = getWallPosition(wellPosition7.x, wellPosition7.y, wallWidth, wallHeight, -Math.PI * 0.11);
    const wellPosition10 = getWallPosition(wellPosition8.x, wellPosition8.y, wallWidth, wallHeight, Math.PI  * 0.11);

    walls.push({ ...wellPosition9});
    walls.push({ ...wellPosition10});

    const wellPosition11 = getWallPosition(wellPosition9.x, wellPosition9.y, wallWidth, wallHeight, wellPosition9.angle);
    const wellPosition12 = getWallPosition(wellPosition10.x, wellPosition10.y, wallWidth, wallHeight, wellPosition10.angle);

    rotatingObstacles.push({
        x: wellPosition10.x - (wellPosition10.x - wellPosition9.x) / 2,
        y: wellPosition9.y + wellPosition9.height / 2,
        width: 800,
        height: 64,
    })

    walls.push({ ...wellPosition11, angle: 0});
    walls.push({ ...wellPosition12, angle: 0});

    
    return {
        name: 'zigzagValley',
        width,
        height,
        walls,
        rotatingObstacles
    };
})();

export default ZIGZAG_VALLEY_CONFIG;