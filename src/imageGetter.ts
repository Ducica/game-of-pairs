import * as Fetching from "./Fetching";

export const listOfAnimals: string[] = [
    "cat",
    "dog",
    // "bunny",
    // "duck",
    "fox",
    // "lizard",
    "shiba",
    "koala",
    "panda",
    "bird",
];
export type animal =
    | "cat"
    | "dog"
    // | "bunny"
    // | "duck"
    | "fox"
    // | "lizard"
    | "shiba"
    | "koala"
    | "panda"
    | "bird"
    | "any";

const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};
export const imageGetter = async (animal: animal, numberOfCards: number) => {
    const arrayOfImgUrls: string[] = [];
    if (animal === "any") {
        const shuffledArrayAnimals: animal[] = shuffleArray([
            ...listOfAnimals,
            ...listOfAnimals,
        ]).slice(0, numberOfCards / 2);
        await Promise.all(
            shuffledArrayAnimals.flatMap(async (animal) => {
                let imgUrl: any = await Fetching[animal]();
                if (!arrayOfImgUrls.includes(imgUrl))
                    arrayOfImgUrls.push(...[imgUrl, imgUrl]);
                return;
            })
        );
        return shuffleArray(arrayOfImgUrls);
    } else if (listOfAnimals.includes(animal)) {
        while (arrayOfImgUrls.length < numberOfCards) {
            let imgUrl: any = await Fetching[animal]();
            if (!arrayOfImgUrls.includes(imgUrl)) {
                arrayOfImgUrls.push(...[imgUrl, imgUrl]);
            }
        }
        return shuffleArray(arrayOfImgUrls);
    }
};
