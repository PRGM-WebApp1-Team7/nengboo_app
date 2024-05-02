// Reactotron 구성
import Reactotron from "reactotron-react-native";
import { AsyncStorage } from "@react-native-async-storage/async-storage";

Reactotron.setAsyncStorageHandler(AsyncStorage)
.configure({ host: '192.168.0.10' })
.useReactNative() 
.connect();

const yeOldeConsoleLog = console.log;
console.log = (...args) => {
yeOldeConsoleLog(...args);
Reactotron.display({
name: 'CONSOLE.LOG',
value: args,
preview: args.length > 0 && typeof args[0] === 'string' ? args[0] : null,
});
};

export default Reactotron;