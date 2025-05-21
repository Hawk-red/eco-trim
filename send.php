<?php
// Проверка, что форма отправлена методом POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Получение данных из формы
    $name = trim($_POST["name"] ?? '');
    $email = trim($_POST["email"] ?? '');
    $subject = trim($_POST["subject"] ?? 'Без темы');
    $message = trim($_POST["message"] ?? '');

    // Укажи здесь свой email
    $to = "ecotrimua@gmail.com";

    // Формируем заголовки письма
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";

    // Тема письма
    $email_subject = "Новое сообщение с сайта EcoTrim: $subject";

    // Тело письма
    $email_body = "Имя: $name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Тема: $subject\n\n";
    $email_body .= "Сообщение:\n$message";

    // Отправка письма
    if (mail($to, $email_subject, $email_body, $headers)) {
        // Перенаправление на страницу благодарности
        header("Location: thank-you.html");
        exit;
    } else {
        // Если не удалось отправить письмо — покажем ошибку
        echo "Ошибка при отправке сообщения. Пожалуйста, попробуйте позже.";
    }

} else {
    // Если форма не отправлена, перенаправить обратно
    header("Location: index.html");
    exit;
}
?>