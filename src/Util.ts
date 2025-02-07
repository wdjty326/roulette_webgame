/**
 * // TODO::
 * 벽 위치 계산
 */
export const getWellPosition = (x: number, y: number, width: number, height: number, angle: number) => {
    const rx = (height / 2) * Math.sin(angle);
    const ry = (height / 2) * Math.cos(angle);
    return {
        x: x - rx,
        y: y + ry + (height / 2),
        width,
        height,
        angle
    }
};