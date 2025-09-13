SELECT
	*
FROM public.inventory;

INSERT INTO public.account (
	account_firstname, 
	account_lastname, 
	account_email, 
	account_password
) VALUES (
	'Tony', 
	'Stark', 
	'tony@starkent.com', 
	'Iam1ronM@n'
);

UPDATE public.account 
SET 
	account_type = 'client'
WHERE
	account_id = 1;

DELETE FROM 
	public.account 
WHERE 
	account_id = 1;

UPDATE 
public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

SELECT 
	inv.inv_make, 
	inv.inv_model 
FROM public.inventory inv
	INNER JOIN 	public.classification cls ON inv.classification_id = cls.classification_id
WHERE
	cls.classification_name = 'sport';

UPDATE 
public.inventory
SET 
	inv_img = REPLACE(inv_img, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')

