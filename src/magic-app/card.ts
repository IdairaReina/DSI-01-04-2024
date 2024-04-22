/**
 * Enumeración para los colores de las cartas.
 */
export enum Color {
    Blanco = "blanco",
    Azul = "azul",
    Negro = "negro",
    Rojo = "rojo",
    Verde = "verde",
    Incoloro = "incoloro",
    Multicolor = "multicolor"
}

/**
 * Enumeración para los tipos de cartas.
 */
export enum CardType {
    Tierra = "Tierra",
    Criatura = "Criatura",
    Encantamiento = "Encantamiento",
    Conjuro = "Conjuro",
    Instantaneo = "Instantáneo",
    Artefacto = "Artefacto",
    Planeswalker = "Planeswalker"
}

/**
 * Enumeración para las rarezas de las cartas.
 */
export enum Rarity {
    Comun = "Común",
    Infrecuente = "Infrecuente",
    Rara = "Rara",
    Mítica = "Mítica"
}

/**
 * Interfaz que define la estructura de los datos de una carta.
 */
export interface CardData {
    id: number;
    name: string;
    manaCost: number;
    color: Color;
    type: CardType;
    rarity: Rarity;
    rulesText: string;
    power?: number;
    toughness?: number; //resistencia
    loyalty?: number;
    marketValue: number;
}

/**
 * Clase que representa una carta.
 */
export class Card {
    private data: CardData;

    /**
     * Crea una instancia de Card.
     * @param data Los datos de la carta.
     */
    constructor(data: CardData) {
        this.data = data;
    }

    // Getters
    get id() {
        return this.data.id;
    }

    get name() {
        return this.data.name;
    }

    get manaCost() {
        return this.data.manaCost;
    }

    get color() {
        return this.data.color;
    }

    get type() {
        return this.data.type;
    }

    get rarity() {
        return this.data.rarity;
    }

    get rulesText() {
        return this.data.rulesText;
    }

    get power() {
        return this.data.power;
    }

    get toughness() {
        return this.data.toughness;
    }

    get loyalty() {
        return this.data.loyalty;
    }

    get marketValue() {
        return this.data.marketValue;
    }

    // Other getters for card properties...

    /**
     * Establece los datos de la carta.
     * @param data Los nuevos datos de la carta.
     */
    setData(data: CardData) {
        this.data = data;
    }

    /**
     * Convierte la carta a formato JSON.
     * @returns Los datos de la carta en formato JSON.
     */
    toJSON(): CardData {
        return this.data;
    }

    /**
     * Crea una instancia de Card a partir de datos en formato JSON.
     * @param json Los datos de la carta en formato JSON.
     * @returns Una nueva instancia de Card.
     */
    static fromJSON(json: CardData): Card {
        return new Card(json);
    }
}