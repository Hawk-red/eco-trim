<?php
// Получаем данные из формы
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$subject = $_POST['subject'] ?? 'Без темы';
$message = $_POST['message'] ?? '';

// Кому отправлять
$to = 'ecotrimua@gmail.com'; // <-- Замени на свой email

// Тема письма
$email_subject = "Новое сообщение с сайта EcoTrim: $subject";

// Содержание письма
$email_body = "Имя: $name\nEmail: $email\n\nСообщение:\n$message";

// Заголовки
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";

// Отправка
if (mail($to, $email_subject, $email_body, $headers)) {
    header("Location: thank-you.html"); // Страница после отправки
} else {
    echo "Ошибка при отправке. Проверьте настройки сервера.";
}
?>