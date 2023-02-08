import { ICard } from "../components/GameBoard";

export const createReactSelectData = (arr: any) => {
    return arr.map((item: any) => ({ value: item, label: item }));
};

export const getUniqueUrls = (arr: ICard[]) => {
    return [...new Set(arr.map((item: ICard) => item.imgUrl))];
};
