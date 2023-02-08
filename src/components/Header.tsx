import React, { useState } from "react";
import {
  Box,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Select,
  Checkbox,
  Text,
  Image,
  Tooltip,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { animal } from "../imageGetter";
import { listOfAnimals } from "../imageGetter";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";
import { IState } from "./GameBoard";

interface IProps {
  applyNewSettings: (
    gameDuration: number,
    numberOfCards: number,
    animal: animal,
    gameLastsIndefinite: boolean
  ) => void;
  applicationState: IState;
}

interface IHeaderState {
  gameDuration: number;
  numberOfCards: number;
  animal: animal;
  gameLastsIndefinite: boolean;
}

const cardNumberOptions = [4, 8, 12, 16, 20];

const Header: React.FC<IProps> = ({ applyNewSettings, applicationState }) => {
  const [state, setState] = useState<IHeaderState>({
    gameDuration: applicationState.gameDuration,
    numberOfCards: applicationState.numberOfCards,
    animal: applicationState.animal,
    gameLastsIndefinite: applicationState.gameLastsIndefinite,
  });
  const applyChanges = () => {
    applyNewSettings(
      state.gameDuration,
      state.numberOfCards,
      state.animal,
      state.gameLastsIndefinite
    );
  };
  const handleChange = (e: any) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <Box h={"6%"} bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <Flex>
              <Text fontWeight={"bold"} fontSize={"22"}>
                Find The Pairs Game
              </Text>{" "}
              <Image src={"game-of-pairs/birds.png"} w={"5"} h={"5"} />
            </Flex>
          </HStack>
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton rounded={"full"} cursor={"pointer"} minW={0}>
                <HamburgerIcon boxSize={"10"} />
              </MenuButton>
              <MenuList>
                <MenuItem closeOnSelect={false}>
                  <Select
                    onClick={(e) => e.stopPropagation()}
                    value={state.animal}
                    onChange={(e) => handleChange(e)}
                    name="animal"
                  >
                    {listOfAnimals
                      .concat("any")
                      .map((animal: string, index: number) => (
                        <option key={index} value={animal}>
                          {animal}
                        </option>
                      ))}
                  </Select>
                </MenuItem>
                <MenuItem>
                  {" "}
                  <Select
                    onClick={(e) => e.stopPropagation()}
                    value={state.numberOfCards}
                    onChange={(e) =>
                      setState({
                        ...state,
                        numberOfCards: parseInt(e.target.value),
                      })
                    }
                    name="numberOfCards"
                  >
                    {cardNumberOptions.map(
                      (cardNumber: number, index: number) => (
                        <option key={index} value={cardNumber}>
                          {cardNumber}
                        </option>
                      )
                    )}
                  </Select>
                </MenuItem>
                <MenuDivider />
                <MenuItem mt={"3"}>
                  <Tooltip
                    label={"check the checkbox to play without time limit"}
                  >
                    <Flex
                      onClick={(e) => e.stopPropagation()}
                      justifyContent={"center"}
                      alignItems={"center"}
                      w={"100%"}
                    >
                      <Slider
                        isDisabled={state.gameLastsIndefinite}
                        minW={"80%"}
                        onClick={(e) => e.stopPropagation()}
                        defaultValue={state.gameDuration}
                        value={state.gameDuration}
                        min={20}
                        max={60}
                        step={1}
                        name="gameDuration"
                        onChange={(val) =>
                          setState({ ...state, gameDuration: val })
                        }
                      >
                        <SliderMark
                          value={state.gameDuration}
                          textAlign="center"
                          bg="blue.500"
                          color="white"
                          mt="-10"
                          ml="-5"
                          w="12"
                        >
                          {state.gameDuration}
                        </SliderMark>

                        <SliderTrack bg="red.100">
                          <Box position="relative" right={10} />
                          <SliderFilledTrack bg="tomato" />
                        </SliderTrack>
                        <SliderThumb boxSize={6} />
                      </Slider>
                      <Box onClick={(e) => e.stopPropagation()} ml={"5"}>
                        <Checkbox
                          isChecked={state.gameLastsIndefinite}
                          name="gameLastsIndefinite"
                          onChange={() =>
                            setState({
                              ...state,
                              gameLastsIndefinite: !state.gameLastsIndefinite,
                            })
                          }
                        ></Checkbox>
                      </Box>
                    </Flex>
                  </Tooltip>
                </MenuItem>
                <MenuItem onClick={applyChanges} as={"button"}>
                  Apply changes
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Header;
