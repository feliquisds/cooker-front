import Stack from './navigators/Stack';
import { ThemeProvider } from './components/ThemeProvider';

export default function App() {
    return (
        <ThemeProvider>
            <Stack />
        </ThemeProvider>
    );
}