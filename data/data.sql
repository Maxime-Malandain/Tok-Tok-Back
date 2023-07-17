INSERT INTO "user" (
        "firstname",
        "lastname",
        "description",
        "address",
        "localization",
        "email",
        "password",
        "thumbnail",
        "created_at",
        "updated_at"
    )
VALUES (
        'maxime',
        'malandain',
        'le pire du monde',
        'normandie',
        'localization',
        'max@gmail.com',
        'tok',
        'image.png',
        NOW(),
        NOW()
    ),
    (
        'chloe',
        'batillet',
        'la pire du monde',
        'paris',
        'localization',
        'looser@gmail.com',
        'la clodo',
        'image.png',
        NOW(),
        NOW()
    );
INSERT INTO "tag" ("name")
VALUES ('maison'),
    ('jardin'),
    ('vetements');
INSERT INTO "advert" (
        "title",
        "content",
        "price",
        "user_id",
        "tag_id",
        "created_at",
        "updated_at"
    )
VALUES (
        'Carte yu-gi-oh',
        'extension 2022',
        50,
        1,
        1,
        NOW(),
        NOW()
    );
INSERT INTO "advert_has_image" (
        "advert_id",
        "thumbnail",
        "created_at",
        "updated_at"
    )
VALUES (1, 'carte_yu_gi_oh_1.png', NOW(), NOW()),
    (1, 'carte_yu_gi_oh_2.png', NOW(), NOW());
INSERT INTO "post" (
        "content",
        "thumbnail",
        "reply_to",
        "user_id",
        "created_at",
        "updated_at"
    )
VALUES (
        'Chat perdu',
        './chat_perdu.png',
        NULL,
        1,
        NOW(),
        NOW()
    ),
    (
        'Chat trouvé peut-être ?',
        'chat.png',
        1,
        2,
        NOW(),
        NOW()
    );
INSERT INTO "message" (
        "content",
        "expediteur",
        "destinataire",
        "conversation_id",
        "created_at"
    )
VALUES (
        'Je ne veux pas faire de back',
        1,
        2,
        1,
        NOW()
    ),
    (
        'Je veux adopter Praveen',
        2,
        1,
        1,
        NOW()
    );
INSERT INTO "favourite" ("advert_id", "user_id")
VALUES (1, 2);
INSERT INTO "like" ("post_id", "user_id")
VALUES (1, 2);