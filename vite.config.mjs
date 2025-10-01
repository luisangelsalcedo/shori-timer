import {defineConfig} from 'vite'

export default defineConfig({
    server:{
        port: 3000,
        host: true
    },
    build:{
        lib:{
            entry:['src/app.js'],
            fileName: 'content',
            name: 'algo'
        }
    }
});