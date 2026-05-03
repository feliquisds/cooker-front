export type Gradient = readonly [string, string, ...string[]];

export type ScreenNavigation<ParamList extends Record<string, any>> = {
	navigate: <RouteName extends keyof ParamList>(screen: RouteName, params?: ParamList[RouteName]) => void;
	replace: <RouteName extends keyof ParamList>(screen: RouteName, params?: ParamList[RouteName]) => void;
    goBack: () => void;
};
