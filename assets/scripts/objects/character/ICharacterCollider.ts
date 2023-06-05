export interface ICharacterCollider {

    onBodyCollider(other, self): void;

    onHeadCollider(other, self): void;

    onAttackCollider(other, self): void;

    onSearchCollider(other): void;
}
