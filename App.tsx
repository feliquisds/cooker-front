import Stack from './navigators/Stack';
import { ThemeProvider } from './styles/ThemeProvider';

export default function App() {
    return (
        <ThemeProvider>
            <Stack />
        </ThemeProvider>
    );
}