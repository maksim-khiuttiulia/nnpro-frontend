import User from "../entities/User";
import {action, observable} from "mobx";

class CurrentUserStore {
    @observable
    private _user : User | undefined

    get user(): User | undefined {
        return this._user;
    }

    @action
    set user(value: User | undefined) {
        this._user = value;
    }
}

export default new CurrentUserStore()