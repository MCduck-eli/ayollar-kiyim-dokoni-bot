export enum ClothingStyle {
    CLASSIC = "CLASSIC",
    CASUAL = "CASUAL",
    SPORTY = "SPORTY",
    KPOP = "K-POP",
    ELEGANT = "ELEGANT",
    ETHNIC = "ETHNIC",
}

export interface IProduct {
    name: string;
    style: ClothingStyle;
    price: number;
    sizes: string[];
    image: string;
}
