# Руководство для Участника

## Как начать

1.  **Настройте среду разработки:**
    *   Установите [Node.js](https://nodejs.org/) (версия 16 или выше).
    *   Установите [Git](https://git-scm.com/).
2.  **Клонируйте репозиторий:**
    ```bash
    git clone https://github.com/your-username/vestigium.git
    ```
3.  **Установите зависимости:**
    ```bash
    cd vestigium
    npm install
    ```
4.  **Запустите в режиме разработки:**
    ```bash
    npm run dev
    ```
5.  **Сборка для продакшена:**
    ```bash
    npm run build
    ```

## Структура проекта

*   `src/`: Исходный код приложения.
*   `public/`: Статические файлы (HTML, CSS, изображения).
*   `contracts/`: Смарт-контракты.
*   `docs/`: Документация.

## Наши стандарты кодирования

*   Мы используем [Prettier](https://prettier.io/) для форматирования кода.
*   Мы следуем [стандартам кодирования Airbnb](https://github.com/airbnb/javascript).

## Как предлагать изменения

1.  Создайте новую ветку: `git checkout -b feature/your-feature-name`
2.  Внесите свои изменения.
3.  Создайте коммит: `git commit -m "feat: Add your feature"`
4.  Отправьте изменения на GitHub: `git push origin feature/your-feature-name`
5.  Создайте Pull Request.

## Как сообщать об ошибках

Используйте [шаблон для баг-репортов](.github/ISSUE_TEMPLATE/bug_report.md) при создании нового issue.

## Как предлагать новые функции

Используйте [шаблон для предложений](.github/ISSUE_TEMPLATE/feature_request.md) при создании нового issue.

## Принципы взаимодействия

Мы строим уважительное и продуктивное сообщество. Пожалуйста, ознакомьтесь с нашим [Кодексом поведения](CODE_OF_CONDUCT.md).
