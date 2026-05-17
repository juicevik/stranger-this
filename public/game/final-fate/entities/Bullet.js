/**
 * Bullet.js
 * Contains the class for shot bullets and functions belonging to it.
 */

class Bullet extends GameObject {

    constructor(middleX, middleY) {
        super();
        this.middleX = middleX;
        this.middleY = middleY;
        super.getOccupiedSpace = bullet_dimension;
        super.updateSpecial = bullet_update;
        super.updateState = function () {};
        super.renderState = bullet_render;
    }
}

//"Bullet" dimension function.
function bullet_dimension() {
    var x = [this.middleX, this.middleX, this.middleX, this.middleX, this.middleX - 1, this.middleX - 1, this.middleX - 1, this.middleX - 1];
    var y = [this.middleY, this.middleY - 1, this.middleY - 2, this.middleY - 3, this.middleY, this.middleY - 1, this.middleY - 2, this.middleY - 3];
    return new Array(x, y);
}

//"Bullet" update function.
function bullet_update() {
    this.middleY = this.middleY - 1;
    if (this.middleY < 3)
        this.invalid = true;
}

//"Bullet" rendering function
function bullet_render(wayToDecide = player.bulletColor, bulletX = this.middleX, bulletY = this.middleY) {
    context.fillStyle = "#fff1a8";
    context.fillRect(bulletX * 10, (bulletY - 3) * 10, 10, 40);
    context.fillStyle = "#ffb04f";
    context.fillRect(bulletX * 10 + 3, (bulletY - 3) * 10, 4, 40);
    context.fillStyle = "#ff2b25";
    context.fillRect(bulletX * 10 + 1, (bulletY - 4) * 10, 8, 8);
}
