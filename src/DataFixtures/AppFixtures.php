<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{

    /**
     * Encodeur de mot de pass
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }


    public function load(ObjectManager $manager)
    {

        $faker = Factory::create('fr_FR');


        for ($u = 0; $u < 10; $u++) {

            $user = new User();

            $chrono = 1;

            $hash = $this->encoder->encodePassword($user, "password");

            $user->setFirstName($faker->firstName)
                ->setLastName($faker->lastName)
                ->setEmail($faker->email)
                ->setPassword($hash);

            $manager->persist($user);

            for ($c = 0; $c < mt_rand(5, 20); $c++) {


                $customer = new Customer();
                $customer->setFirstName($faker->firstName)
                    ->setLastName($faker->lastName)
                    ->setCompany($faker->company)
                    ->setEmail($faker->email)
                    ->setUser($user);

                for ($i = 0; $i < mt_rand(3, 12); $i++) {
                    $invoice = new Invoice();
                    $invoice->setCustomer($customer)
                        ->setAmount($faker->randomFloat(2, 250, 5000))
                        ->setSentAt($faker->dateTimeBetween('-6 months'))
                        ->setStatus($faker->randomElement(['SENT', 'PAYED', 'CANCELED']))
                        ->setChrono($chrono);

                    $chrono++;

                    $manager->persist($invoice);
                }

                $manager->persist($customer);

            }

        }


        $manager->flush();
    }
}
