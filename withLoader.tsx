import React, { useState, useEffect, createElement } from "react";
import { InteractionManager } from "react-native";
import { Spinner, Text, Container, Body } from "native-base";

export type LoaderOptions<P> = {
  onLoad?: (props: P) => object;
  onLoadAsync?: (props: P) => Promise<any>;
  watchProps?: (props: P) => object[];
};

export interface LoaderProps {
  loaded: boolean;
  reload(): Promise<void>;
}

type ComponentType = | React.ComponentClass
  | React.StatelessComponent
  | ((props: any) => any)

export default function withLoader<P = {}>(options: LoaderOptions<P>) {
  return (Component: ComponentType) => {
    return (innerProps: P) => {
      const [isReady, setIsReady] = useState(false);
      const [props, setProps] = useState({});

      async function reload() {
        setIsReady(true);

        let props = {};

        try {
          if (options.onLoad) props = options.onLoad(innerProps);
          else if (options.onLoadAsync) props = await options.onLoadAsync(innerProps);
        }
        catch (e) {
          console.log("Failed on onLoad callback", e)
        }

        console.log("Loaded")
        setProps(props);
        setIsReady(true);
      }

      useEffect(() => {
        InteractionManager.runAfterInteractions(reload);

        return () => setIsReady(false)
      }, []);

      if (options.watchProps) {
        let watchProps = options.watchProps(innerProps)
        if (watchProps.length > 0) {
          useEffect(() => {
            if (isReady)
              reload()
          }, watchProps)
        }
      }

      if (!isReady)
        return (
          <Container style={{ flex: 1, backgroundColor: "#727" }}>
            <Body style={{ alignItems: "center", justifyContent: "center" }}>
              <Spinner color="#FFF" />
              <Text
                style={{
                  color: "#FFF",
                  marginTop: 30,
                  fontSize: 32,
                  fontWeight: "bold"
                }}
              >
                Carregando...
              </Text>
            </Body>
          </Container>
        );
      else {
        const realProps: P = { ...innerProps, ...props, reload, loaded: isReady };
        const element = createElement(Component, realProps);

        return element;
      }
    };
  };
}
