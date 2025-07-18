# Сценарии тестирования для проекта "След / Vestigium / 迹 (Jì)"

## 1. Функциональное тестирование

### 1.1. Создание "следа"

*   **Сценарий 1.1.1:** Создание "следа" с текстовым содержимым.
    *   **Шаги:**
        1.  Открыть приложение.
        2.  Нажать кнопку "Создать след".
        3.  Ввести текст в поле ввода.
        4.  Нажать кнопку "Сохранить".
    *   **Ожидаемый результат:** "След" с текстовым содержимым успешно создан и сохранен в IPFS и OrbitDB.

*   **Сценарий 1.1.2:** Создание "следа" с изображением.
    *   **Шаги:**
        1.  Открыть приложение.
        2.  Нажать кнопку "Создать след".
        3.  Выбрать изображение для загрузки.
        4.  Нажать кнопку "Сохранить".
    *   **Ожидаемый результат:** "След" с изображением успешно создан и сохранен в IPFS и OrbitDB.

*   **Сценарий 1.1.3:** Создание "следа" с 3D-моделью.
    *   **Шаги:**
        1.  Открыть приложение.
        2.  Нажать кнопку "Создать след".
        3.  Выбрать .glTF модель для загрузки.
        4.  Нажать кнопку "Сохранить".
    *   **Ожидаемый результат:** "След" с 3D-моделью успешно создан и сохранен в IPFS и OrbitDB.

### 1.2. Просмотр "следов"

*   **Сценарий 1.2.1:** Просмотр "следа" в AR.
    *   **Шаги:**
        1.  Открыть приложение.
        2.  Навести камеру на маркер.
    *   **Ожидаемый результат:** "След" корректно отображается в AR-режиме.

### 1.3. Геолокация

*   **Сценарий 1.3.1:** Проверка точности GPS-привязки.
    *   **Шаги:**
        1.  Создать "след" в определенном месте.
        2.  Отойти на некоторое расстояние и вернуться.
    *   **Ожидаемый результат:** "След" отображается на карте и в AR в правильном месте.

## 2. Тестирование децентрализованной инфраструктуры

### 2.1. Доступность IPFS

*   **Сценарий 2.1.1:** Проверка доступности объекта из IPFS.
    *   **Шаги:**
        1.  Создать "след" с любым содержимым.
        2.  Скопировать CID объекта.
        3.  Открыть CID в другом браузере или на другом устройстве.
    *   **Ожидаемый результат:** Объект успешно загружается из IPFS.

### 2.2. Синхронизация OrbitDB

*   **Сценарий 2.2.1:** Проверка синхронизации данных между клиентами.
    *   **Шаги:**
        1.  Открыть приложение на двух устройствах.
        2.  Создать "след" на одном устройстве.
    *   **Ожидаемый результат:** "След" появляется на втором устройстве.
