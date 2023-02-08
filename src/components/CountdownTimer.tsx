import React, { useEffect } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import { Text, Box } from "@chakra-ui/react";

interface IProps {
    gameDuration: number;
    gameLastsIndefinite: boolean;
    isGameFinished: boolean;
    timerRunOut: () => void;
    counterKey: string;
}
export default function CountdownTimer({
    gameDuration,
    gameLastsIndefinite,
    isGameFinished,
    timerRunOut,
    counterKey,
}: IProps) {
    const time = React.useMemo(() => {
        return Date.now();
    }, [counterKey]);
    const RendererCountdown = (props: CountdownRenderProps) => {
        return <Renderer {...props} />;
    };

    const Renderer = (props: CountdownRenderProps) => {
        useEffect(() => {
            props.api.start();
        }, [props.api]);
        useEffect(() => {
            if (isGameFinished) props.api.pause();
        }, [props.api]);
        if (props.completed) {
            return <Box></Box>;
        } else {
            // if (isGameFinished) props.api.pause();
            // Render a countdown
            // props.api.start();
            return (
                <Text
                    fontSize={"15"}
                    fontWeight={"bold"}
                    color={
                        props.minutes * 60 + props.seconds <= 10
                            ? "tomato"
                            : "blue"
                    }
                >
                    Time remaining:{" "}
                    {props.minutes ? props.minutes * 60 : props.seconds}
                </Text>
            );
        }
    };
    return (
        <Countdown
            autoStart={false}
            date={time + gameDuration * 1000}
            renderer={RendererCountdown}
            onComplete={timerRunOut}
            // key={counterKey}
        />
    );
}
