module.exports = class UserDto {
    email;
    id;
    username;
    isActivated;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.username = model.username;
        this.isActivated = model.isActivated;
    }
}