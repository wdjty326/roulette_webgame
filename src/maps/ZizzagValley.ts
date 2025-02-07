import { getWallPosition } from "../Util";

/**  */
const ZIGZAG_VALLEY_CONFIG = (() => {
    const width = 2880;
    const height = 12800;

    // 수직 벽의 높이와 위치 계산
    const wallWidth = 64;
    const wallHeight = height / 5;
    const wallY = 0;
    const leftX = width / 2 - 1024;
    const rightX = width / 2 + 1024;

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

    const wellPosition1 = getWallPosition(leftX, wallY, wallWidth, wallHeight, Math.PI / 4);
    const wellPosition2 = getWallPosition(rightX, wallY, wallWidth, wallHeight, Math.PI / 4);

    walls.push(wellPosition1);
    walls.push(wellPosition2);

    const wellPosition3 = getWallPosition(wellPosition1.x, wellPosition1.y, wallWidth, wallHeight, wellPosition1.angle);
    const wellPosition4 = getWallPosition(wellPosition2.x, wellPosition2.y, wallWidth, wallHeight, wellPosition2.angle);

    walls.push({ ...wellPosition3, angle: 0});
    walls.push({ ...wellPosition4, angle: 0});

    const wellPosition5 = getWallPosition(wellPosition3.x, wellPosition3.y, wallWidth, wallHeight, -Math.PI / 4);
    const wellPosition6 = getWallPosition(wellPosition4.x, wellPosition4.y, wallWidth, wallHeight, -Math.PI / 4);

    walls.push(wellPosition5);
    walls.push(wellPosition6);

    const wellPosition7 = getWallPosition(wellPosition5.x, wellPosition5.y, wallWidth, wallHeight, wellPosition5.angle);
    const wellPosition8 = getWallPosition(wellPosition6.x, wellPosition6.y, wallWidth, wallHeight, wellPosition6.angle);

    walls.push({ ...wellPosition7, angle: 0});
    walls.push({ ...wellPosition8, angle: 0});

    
    return {
        name: 'zigzagValley',
        width,
        height,
        walls
    };
})();

export default ZIGZAG_VALLEY_CONFIG;