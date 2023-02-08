import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    useMediaQuery,
    Text,
    Spinner,
    Center,
} from "@chakra-ui/react";
import React, { useEffect, useState, useCallback } from "react";
import { imageGetter } from "../imageGetter";
import { v4 as uuidv4 } from "uuid";
import { animal } from "../imageGetter";
import Header from "./Header";
import CountdownTimer from "./CountdownTimer";
import { getUniqueUrls } from "../utils/helperFunctions";
import useLocalStorage from "use-local-storage";

const cardBack = "card.png";

export interface ICard {
    turned: boolean;
    imgUrl: string;
    id: string;
}

export interface IState {
    isGameFinished: boolean;
    isGameLost: boolean;
    currentPick: ICard[];
    cardData: ICard[];
    numberOfCards: number;
    gameDuration: number;
    animal: animal;
    moves: number;
    gameLastsIndefinite: boolean;
    randomCode: string;
}
export default function GameBoard() {
    const [isLargerThan800] = useMediaQuery("(min-width: 800px)");
    const [isLoading, setLoading] = useState<boolean>(true);
    const [highScore, setHighScore] = useLocalStorage<any>("highscore", "");
    const [state, setState] = useState<IState>({
        isGameFinished: false,
        currentPick: [],
        cardData: [],
        numberOfCards: 4,
        gameDuration: 60,
        animal: "dog",
        moves: 0,
        gameLastsIndefinite: true,
        isGameLost: false,
        randomCode: uuidv4(),
    });
    const timerRunOut = () => {
        if (state.isGameLost) return;
        setState((prevState) => ({
            ...prevState,
            isGameLost: true,
            isGameFinished: true,
        }));
    };
    const cacheImages = async (imgUrlArray: string[]) => {
        const promises = imgUrlArray.map((src) => {
            return new Promise<void>(function (resolve, reject) {
                const img = new Image();
                img.src = src;
                img.onload = () => resolve();
                img.onerror = () => reject();
            });
        });
        await Promise.all(promises);
    };
    const getImages = useCallback(
        async (animal: animal, numberOfCards: number) => {
            const imagesArray = await imageGetter(animal, numberOfCards);
            const cardInformation = imagesArray?.map((imgUrl: string) => {
                return { turned: false, imgUrl: imgUrl, id: uuidv4() };
            });
            return cardInformation;
        },
        [state.animal, state.numberOfCards]
    );

    const restartGame = useCallback(async () => {
        setLoading(true);
        const imagesArray = await getImages(state.animal, state.numberOfCards);

        if (imagesArray) await cacheImages(getUniqueUrls(imagesArray));
        if (imagesArray)
            setState((prevState) => ({
                ...prevState,
                cardData: imagesArray,
                currentPick: [],
                isGameFinished: false,
                moves: 0,
                gameDuration: state.gameDuration,
                isGameLost: false,
                numberOfCards: state.numberOfCards,
                randomCode: uuidv4(),
            }));
        setLoading(false);
    }, [state.animal, state.numberOfCards, getImages, state.gameDuration]);

    const applyNewSettings = async (
        gameDuration: number,
        numberOfCards: number,
        animal: animal,
        gameLastsIndefinite: boolean
    ) => {
        setLoading(true);
        const imagesArray = await getImages(animal, numberOfCards);
        if (imagesArray) await cacheImages(getUniqueUrls(imagesArray));
        if (imagesArray)
            setState((prevState) => ({
                ...prevState,
                cardData: imagesArray,
                currentPick: [],
                isGameFinished: false,
                moves: 0,
                gameDuration: gameDuration,
                isGameLost: false,
                gameLastsIndefinite: gameLastsIndefinite,
                animal: animal,
                numberOfCards,
                randomCode: uuidv4(),
            }));
        setLoading(false);
    };
    const turnCard = (id: string) => {
        if (state.currentPick.length >= 2) return;
        if (state.isGameLost) return;
        const clickedCard = state.cardData.find(
            (card: ICard) => card.id === id
        );
        const cardsArray = state.cardData.map((card: ICard) => {
            if (card.id === id) return { ...card, turned: true };
            else return card;
        });

        if (clickedCard)
            setState({
                ...state,
                cardData: cardsArray,
                currentPick: state.currentPick.concat(clickedCard),
            });
    };
    const checkCardEquality = useCallback(() => {
        const [card1, card2]: ICard[] = state.currentPick;
        // if (state.isGameFinished === true) return;
        if (card1.imgUrl === card2.imgUrl) {
            setState((prevState) => ({
                ...prevState,
                currentPick: [],
                moves: state.moves + 1,
            }));
        } else {
            const cardsArray1 = state.cardData.map((card: ICard) => {
                if (card.id === card1.id || card.id === card2.id)
                    return { ...card, turned: false };
                else return card;
            });
            setState((prevState) => ({
                ...prevState,
                currentPick: [],
                cardData: cardsArray1,
                moves: state.moves + 1,
            }));
        }
    }, [state.cardData, state.currentPick, state.moves]);
    useEffect(() => {
        const loadStartingGameData = async () => {
            const startingCards = await getImages(
                state.animal,
                state.numberOfCards
            );
            if (startingCards)
                setState((prevState) => ({
                    ...prevState,
                    cardData: startingCards,
                }));
            setLoading(false);
        };
        loadStartingGameData();
    }, [getImages]);

    useEffect(() => {
        if (state.currentPick?.length === 2) {
            setTimeout(() => checkCardEquality(), 1000);
        }
    }, [state.currentPick, checkCardEquality]);

    useEffect(() => {
        if (
            state.cardData.filter((card: ICard) => card.turned === true)
                .length === state.numberOfCards
        )
            setTimeout(() => {
                setState((prevState) => ({
                    ...prevState,
                    isGameFinished: true,
                    isGameLost: false,
                    moves: state.moves + 1,
                }));
                if (!highScore) {
                    setHighScore(state.moves);
                } else if (state.moves < highScore)
                    setHighScore(state.moves + 1);
            }, 1000);
    }, [state.cardData, state.numberOfCards]);

    return (
        <Box mb={0} h={"100vh"}>
            <Header
                applicationState={state}
                applyNewSettings={applyNewSettings}
            />
            {isLoading ? (
                <Box mb={0} h={"94%"} bg={"blue.200"}>
                    {" "}
                    <Center h={"500"}>
                        <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="blue.500"
                            size="xl"
                        />
                    </Center>
                </Box>
            ) : (
                <Box mb={0} h={"94%"} bg={"blue.200"}>
                    <Flex
                        justifyContent={"space-between"}
                        alignItems={"center"}
                    >
                        <Box mt={2} ml={5} transitionDuration={"1000ms"}>
                            <Text fontSize={"15"} fontWeight={"bold"}>
                                Moves: {state.moves}
                            </Text>
                        </Box>
                        <Box mt={2}>
                            <Text fontSize={"15"} fontWeight={"bold"}>
                                Highscore:{" "}
                                {highScore
                                    ? `${highScore} moves`
                                    : "you did not win yet!"}
                            </Text>
                        </Box>

                        {!state.gameLastsIndefinite ? (
                            <Box mt={2} mr={5}>
                                <CountdownTimer
                                    gameDuration={state.gameDuration}
                                    gameLastsIndefinite={
                                        state.gameLastsIndefinite
                                    }
                                    isGameFinished={state.isGameFinished}
                                    timerRunOut={timerRunOut}
                                    counterKey={state.randomCode}
                                />{" "}
                            </Box>
                        ) : (
                            <Box mt={2}></Box>
                        )}
                    </Flex>
                    <Grid
                        mt={2}
                        margin={"auto"}
                        maxW={isLargerThan800 ? "50vw" : "80vw"}
                        templateRows="repeat(3, 1fr)"
                        templateColumns={
                            state.numberOfCards % 5 === 0
                                ? "repeat(5, 1fr)"
                                : "repeat(4, 1fr)"
                        }
                        gap={"1vh"}
                    >
                        {state.cardData.map((card: ICard) => (
                            <GridItem
                                key={card.id}
                                position={"relative"}
                                width={"15"}
                                height={"18vh"}
                            >
                                {" "}
                                {card.turned ? (
                                    <Box
                                        borderRadius={"8"}
                                        as={"img"}
                                        maxW={"100%"}
                                        minW={"100%"}
                                        maxH={"100%"}
                                        minH={"100%"}
                                        position={"absolute"}
                                        m={"auto"}
                                        top={0}
                                        left={0}
                                        right={0}
                                        bottom={0}
                                        src={card.imgUrl}
                                        transitionDuration={"1000ms"}
                                        transform={
                                            card.turned
                                                ? "rotateY(180deg)"
                                                : "rotateY(0deg)"
                                        }
                                    />
                                ) : (
                                    <Box
                                        bgColor={"white"}
                                        as="img"
                                        src={cardBack}
                                        _hover={{
                                            boxShadow:
                                                "0px 10px 20px rgba(0,0,0,0.3)",
                                            transform: "translateY(-10px)",
                                            cursor: "pointer",
                                        }}
                                        maxW={"100%"}
                                        minW={"100%"}
                                        maxH={"100%"}
                                        minH={"100%"}
                                        position={"absolute"}
                                        m={"auto"}
                                        top={0}
                                        left={0}
                                        right={0}
                                        bottom={0}
                                        backface-visibility={"hidden    "}
                                        onClick={() => turnCard(card.id)}
                                        transitionDuration={"1000ms"}
                                        transform={
                                            card.turned
                                                ? "rotateY(180deg)"
                                                : "rotateY(0deg)"
                                        }
                                    />
                                )}
                            </GridItem>
                        ))}
                    </Grid>
                    )
                    {state.isGameFinished && !state.isGameLost && (
                        <Box mt={2} textAlign={"center"}>
                            <Box>
                                <Text fontSize={"15"} fontWeight={"bold"}>
                                    Congrats, you finished the game!
                                </Text>
                            </Box>
                        </Box>
                    )}
                    {state.isGameLost && (
                        <Box mt={2} textAlign={"center"}>
                            <Text fontSize={"15"} fontWeight={"bold"}>
                                Sorry, you lost, try again!
                            </Text>
                        </Box>
                    )}
                    <Box
                        position={"absolute"}
                        bottom={2}
                        mt={2}
                        left={"0"}
                        right={"0"}
                        textAlign={"center"}
                    >
                        <Button
                            isActive={!isLoading}
                            bg={"blue.200"}
                            onClick={restartGame}
                        >
                            Restart Game
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
