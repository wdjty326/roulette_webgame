export const getWallPosition = (
    startX: number,    // 시작점 X
    startY: number,    // 시작점 Y
    width: number,     // 벽 두께
    height: number,    // 벽 높이
    angle: number      // 각도
) => {
    // 시작점에서 중심점으로의 오프셋 계산
    const dx = (height/2) * Math.sin(angle);
    const dy = (height/2) * Math.cos(angle) + (height/2);

    return {
        x: startX - dx,  // 중심점 X
        y: startY + dy,  // 중심점 Y
        width,
        height,
        angle
    };
};