import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Difficulty } from "../model/Difficulty";
import globalColors from "../styles/Colors";
import globalStyles from "../styles/Styles";
import { Section } from "./Alignments";
import { Subtext } from "./Texts";
import { useThemeMode } from "./ThemeProvider";

export function ReviewChip({ score }: { score: number }) {
    const { theme } = useThemeMode();

    return (
        <Section style={[globalStyles(theme).chip, globalStyles(theme).reviewChip]}>
            <Subtext style={{ color: globalColors(theme).yellowHighlight }}>{score}</Subtext>
        </Section>
    );
}

export function DifficultyChip({ difficulty }: { difficulty: Difficulty }) {
    const { theme } = useThemeMode();
    const difficultyStyles = {
        EASY: globalStyles(theme).difficultyChipEasy,
        MEDIUM: globalStyles(theme).difficultyChipMedium,
        HARD: globalStyles(theme).difficultyChipHard,
    };
    const difficultyColors = {
        EASY: globalColors(theme).greenHighlight,
        MEDIUM: globalColors(theme).orangeHighlight,
        HARD: globalColors(theme).redHighlight,
    };
    const difficultyLabels = {
        EASY: 'Fácil',
        MEDIUM: 'Médio',
        HARD: 'Difícil',
    };
    const difficultyAmountStars = {
        EASY: 1,
        MEDIUM: 2,
        HARD: 3,
    };

    return (
        <Section gap={5} centerVertical horizontal style={[globalStyles(theme).chip, difficultyStyles[difficulty]]}>
            <Section horizontal>
                {Array.from({ length: difficultyAmountStars[difficulty] }, (_, i) => (
                    <MaterialCommunityIcons key={i} name="star" size={14} color={difficultyColors[difficulty]} />
                ))}
            </Section>
             <Subtext style={{ color: difficultyColors[difficulty] }}>
                {difficultyLabels[difficulty]}
            </Subtext>
        </Section>
    );
}

export function TimeChip({ time }: { time: number }) {
    const { theme } = useThemeMode();

    return (
        <Section centerVertical horizontal gap={5} style={globalStyles(theme).chip}>
            <MaterialCommunityIcons name="clock-time-four-outline" size={14} color={globalColors(theme).subtext} />
            <Subtext>{time} min</Subtext>
        </Section>
    );
}

export function PortionChip({ portions }: { portions: number }) {
    const { theme } = useThemeMode();

    return (
        <Section centerVertical horizontal gap={5} style={globalStyles(theme).chip}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={14} color={globalColors(theme).subtext} />
            <Subtext>{portions} {portions === 1 ? 'porção' : 'porções'}</Subtext>
        </Section>
    );
}