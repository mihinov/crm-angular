# crm-angular

## Команды для запуска

<style>
    .block {
        border: 2px solid tomato;
        display: inline-block;
        padding: 10px;
    }

    .block:not(:first-child) {
        margin-bottom: 20px;
    }
</style>

<div style="border: 2px solid tomato; display: inline-block; padding: 10px; margin: 10px 0 20px 0">

<h2 style="border-bottom: none">Если у вас Windows:</h2>

1. Склонировать репозиторий `git clone https://github.com/mihinov/crm-angular`
2. Зайти в корень проекта `cd crm-angular`
3. Зайти в папку backend `cd backend`
4. Установить зависимости для backend `npm install`
5. Зайти в папку client `cd ../client`
6. Установить зависимости для client `npm install`
7. Вернуться в корень проекта `cd ..`

</div>

<div style="border: 2px solid tomato; display: inline-block; padding: 10px; margin-bottom: 20px">
<h2 style="border-bottom: none">Если у вас UNIX система (MAC, Linux):</h2>

1. Склонировать репозиторий `git clone https://github.com/mihinov/crm-angular`
1. Перейти в корень проекта `cd crm-angular`
1. Установить все пакеты `npm run all-install`

</div>

Запустить одну из трех команд ниже:
- `npm run server` - запустить сервер, используя nodemon
- `npm run client` - запустить Angular
- `npm run dev` - запустить сервер и Angular
