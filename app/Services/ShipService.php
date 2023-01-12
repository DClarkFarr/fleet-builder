<?php

namespace App\Services;

use App\Models\Ship;
use App\Models\ShipClass;
use App\Models\ShipLevel;
use App\Models\User;
use App\Models\UserShip;
use App\Models\Workshop;
use App\Models\WorkshopFleet;
use Exception;

class ShipService
{
    public function createShipLevel(string $name, int $sort)
    {
        $shipLevel = new ShipLevel;
        $shipLevel->name = $name;
        $shipLevel->sort = $sort;
        $shipLevel->save();

        $this->insertLevelInOrder($shipLevel);

        return $shipLevel;
    }

    public function insertLevelInOrder(ShipLevel $shipLevel)
    {
        $shipLeveles = ShipLevel::where('sort', '>=', $shipLevel->sort)->where('id_level', '!=', $shipLevel->id_level)->orderBy('sort', 'asc')->get();
        foreach ($shipLeveles as $shipLevel) {
            $shipLevel->sort++;
            $shipLevel->save();
        }
    }

    public function removeFromLevelOrder(ShipLevel $shipLevel)
    {
        $shipLeveles = ShipLevel::where('sort', '>', $shipLevel->sort)->orderBy('sort', 'asc')->get();
        foreach ($shipLeveles as $shipLevel) {
            $shipLevel->sort--;
            $shipLevel->save();
        }
    }

    public function updateShipLevel(int $id_level, string $name, int $sort)
    {
        $shipLevel = ShipLevel::find($id_level);

        if (!$shipLevel) {
            return [false, 'Ship level not found'];
        }

        if (!$shipLevel->validateName($name)) {
            return [false, 'Name already exists'];
        }

        $shouldResort = $shipLevel->sort !== $sort;

        $shipLevel->name = $name;
        $shipLevel->sort = $sort;

        $shipLevel->save();

        if ($shouldResort) {
            $this->insertLevelInOrder($shipLevel);
        }

        return [true, $shipLevel];
    }

    public function deleteShipLevel(int $id_level)
    {
        $shipLevel = ShipLevel::find($id_level);

        if (!$shipLevel) {
            return [false, 'Ship level not found'];
        }

        $shipLevel->delete();

        $this->removeFromLevelOrder($shipLevel);

        return [true, 'Ship level deleted'];
    }

    public function createShipClass(string $name, int $sort)
    {
        $shipClass = new ShipClass;
        $shipClass->name = $name;
        $shipClass->sort = $sort;
        $shipClass->save();

        $this->insertClassInOrder($shipClass);

        return $shipClass;
    }

    public function insertClassInOrder(ShipClass $shipClass)
    {
        $shipClasses = ShipClass::where('sort', '>=', $shipClass->sort)->where('id_class', '!=', $shipClass->id_class)->orderBy('sort', 'asc')->get();
        foreach ($shipClasses as $shipClass) {
            $shipClass->sort++;
            $shipClass->save();
        }
    }

    public function removeFromClassOrder(ShipClass $shipClass)
    {
        $shipClasses = ShipClass::where('sort', '>', $shipClass->sort)->orderBy('sort', 'asc')->get();
        foreach ($shipClasses as $shipClass) {
            $shipClass->sort--;
            $shipClass->save();
        }
    }

    public function updateShipClass(int $id_class, string $name, int $sort)
    {
        $shipClass = ShipClass::find($id_class);

        if (!$shipClass) {
            return [false, 'Ship class not found'];
        }

        if (!$shipClass->validateName($name)) {
            return [false, 'Name already exists'];
        }

        $shouldResort = $shipClass->sort !== $sort;

        $shipClass->name = $name;
        $shipClass->sort = $sort;

        $shipClass->save();

        if ($shouldResort) {
            $this->insertClassInOrder($shipClass);
        }

        return [true, $shipClass];
    }

    public function deleteShipClass(int $id_class)
    {
        $shipClass = ShipClass::find($id_class);

        if (!$shipClass) {
            return [false, 'Ship class not found'];
        }

        $shipClass->delete();

        $this->removeFromClassOrder($shipClass);

        return [true, 'Ship class deleted'];
    }

    public function createShip(array $data)
    {
        $ship = new Ship;
        $ship->name = $data['name'];
        $ship->energy = $data['energy'];
        $ship->id_class = $data['id_class'];
        $ship->id_level = $data['id_level'];
        $ship->public = $data['public'];
        $ship->save();

        return $ship;
    }

    public function updateShip(int $id_ship, array $data)
    {
        $ship = Ship::find($id_ship);
        if (!$ship) {
            throw new Exception('Ship not found', 404);
        }

        if ($data['name'] != $ship->name && !$ship->validateName($data['name'])) {
            throw new Exception('Name already exists', 400);
        }

        $ship->name = $data['name'];
        $ship->energy = $data['energy'];
        $ship->id_class = $data['id_class'];
        $ship->id_level = $data['id_level'];
        $ship->public = $data['public'];

        $ship->save();

        return $ship;
    }

    public function getShip(int $id_ship, $forResponse = false)
    {
        $ship = Ship::find($id_ship);
        if (!$ship) {
            throw new \Exception('Ship not found', 404);
        }

        if ($forResponse) {
            return $this->populateShipForResponse($ship);
        }

        return $ship;
    }

    public function getShips($options = [])
    {
        $options = array_merge([
            'public' => true,
        ], $options);

        $query = Ship::query();

        if ($options['public']) {
            $query->where('public', true);
        }

        $ships = $query->get()
            ->map(function ($ship) {
                return $this->populateShipForResponse($ship);
            })
            ->sort(function (Ship $sa, Ship $sb) {
                if ($sa->shipLevel->sort != $sb->shipLevel->sort) {
                    return $sb->shipLevel->sort <=> $sa->shipLevel->sort;
                }

                if ($sa->shipClass->sort != $sb->shipClass->sort) {
                    return $sb->shipClass->sort <=> $sa->shipClass->sort;
                }

                return $sb->energy <=> $sa->energy;
            })
            ->values();

        return $ships;
    }

    public function populateShipForResponse(Ship $ship)
    {
        $ship->load(['shipClass', 'shipLevel', 'shipSlots', 'abilities']);

        return $ship;
    }

    public function populateWorkshopForResponse(Workshop $workshop, $shallow = false)
    {
        $workshop->load(['fleets', 'fleets.userShips']);

        if (!$shallow) {
            $workshop->fleets->each(function ($fleet) {
                $this->populateFleetForResponse($fleet);
            });
        }

        return $workshop;
    }

    public function populateFleetForResponse(WorkshopFleet $fleet)
    {
        $fleet->load(['userShips']);

        $fleet->userShips->each(function ($userShip) {
            $userShip->ship = $this->populateShipForResponse($userShip->ship);
        });

        return $fleet;
    }

    public function updateSlotsByType(int $id_ship, string $type, array $slots)
    {
        $ship = Ship::find($id_ship);
        if (!$ship) {
            throw new \Exception('Ship not found', 404);
        }

        foreach ($slots as $size => $amount) {
            $this->syncShipSlot($ship, $type, $size, $amount);
        }

        return $ship;
    }

    public function syncShipSlot(Ship $ship, string $type, string $size, int $amount)
    {
        $slot = $ship->shipSlots()->where('type', $type)->where('size', $size)->first();
        if ($slot) {
            $slot->amount = $amount;
            $slot->save();
        } else {
            $slot = $ship->shipSlots()->create([
                'type' => $type,
                'size' => $size,
                'amount' => $amount,
            ]);
        }

        return $slot;
    }

    public function updateShipAbilities(int $id_ship, string $location, array $abilities)
    {
        $ship = Ship::find($id_ship);
        if (!$ship) {
            throw new \Exception('Ship not found', 404);
        }

        $currentAbilities = $ship->abilities()->where('location', $location)->get();

        foreach ($abilities as $data) {
            if (!empty($data['id_ability'])) {
                $ability = $currentAbilities->where('id_ability', $data['id_ability'])->first();
                if ($ability) {
                    $ability->fill($data);
                    $ability->save();
                }
            } else {
                $ability = $ship->abilities()->create(array_merge($data, ['location' => $location]));

                $currentAbilities->push($ability);
            }
        }

        return $currentAbilities;
    }

    public function deleteShipAbility(int $id_ship, int $id_ability)
    {
        $ship = Ship::find($id_ship);
        if (!$ship) {
            throw new \Exception('Ship not found', 404);
        }

        $ship->abilities()->where('id_ability', $id_ability)->delete();
    }

    /**
     * Get public user ships, sorted nicely by class and level
     *
     * @param [type] $id_user
     * @return Collection<UserShip>
     */
    public function getUserShips($id_user)
    {
        $ships = UserShip::where('id_user', $id_user)
            ->with('ship')
            ->whereHas('ship', function ($query) {
                $query->where('public', true);
            })
            ->get()
            ->map(function ($userShip) {
                $userShip->ship = $this->populateShipForResponse($userShip->ship);

                return $userShip;
            })
            ->sort(function (UserShip $sa, UserShip $sb) {
                if ($sa->ship->shipLevel->sort != $sb->ship->shipLevel->sort) {
                    return $sb->ship->shipLevel->sort <=> $sa->ship->shipLevel->sort;
                }

                if ($sa->ship->shipClass->sort != $sb->ship->shipClass->sort) {
                    return $sb->ship->shipClass->sort <=> $sa->ship->shipClass->sort;
                }

                return $sb->ship->energy <=> $sa->ship->energy;
            })
            ->values();


        return $ships;
    }

    public function createOrUpdateUserShip(User $user, array $data)
    {
        $id_user_ship = $data['id_user_ship'] ?? null;
        unset($data['id_user_ship']);

        if ($id_user_ship) {
            $userShip = UserShip::find($id_user_ship);
            if (!$userShip) {
                throw new \Exception('User ship not found', 404);
            }
        } else {
            $userShip = new UserShip();
            $userShip->id_user = $user->id;
            $userShip->visible = true;
        }

        $userShip->fill($data);
        $userShip->save();

        $userShip->ship = $this->populateShipForResponse($userShip->ship);

        return $userShip;
    }

    public function deleteUserShip(User $user, $id_user_ship)
    {
        $ship = $user->ships()->find($id_user_ship);
        if (!$ship) {
            throw new \Exception('Ship not found', 404);
        }
        $ship->delete();
    }

    public function createOrUpdateWorkshop(User $user, $data)
    {
        $id_workshop = $data['id_workshop'] ?? null;
        unset($data['id_workshop']);

        if ($id_workshop) {
            $workshop = Workshop::find($id_workshop);
            if (!$workshop) {
                throw new \Exception('Workshop not found', 404);
            }
        } else {
            $workshop = new Workshop();
            $workshop->id_user = $user->id;
        }

        $workshop->fill($data);
        $workshop->save();

        return $workshop;
    }

    public function listWorkshops(User $user)
    {
        $workshops = $user->workshops->map(function ($workshop) {
            return $this->populateWOrkshopForResponse($workshop, true);
        });

        return $workshops;
    }

    public function deleteWorkshop(User $user, $id_workshop)
    {
        $workshop = $user->workshops()->find($id_workshop);
        if (!$workshop) {
            throw new \Exception('Workshop not found', 404);
        }

        $workshop->fleets()->delete();
        $workshop->delete();
    }

    public function createOrUpdateWorkshopFleet(User $user, $id_workshop, $data)
    {

        $workshop = $user->workshops()->find($id_workshop);

        if (!$workshop) {
            throw new \Exception('Workshop not found', 404);
        }

        $fleet = $workshop->fleets()->where('location', $data['location'])->first();

        if (!$fleet) {
            $fleet = new WorkshopFleet();
            $fleet->id_workshop = $workshop->id_workshop;
            $fleet->id_user = $user->id;
            $fleet->location = $data['location'];
        }

        $fleet->name = $data['name'];
        $fleet->leadership = $data['leadership'];
        $fleet->save();

        return $this->populateFleetForResponse($fleet);
    }

    public function getWorkshopFleets(User $user, $id_workshop)
    {
        $workshop = $user->workshops()->find($id_workshop);
        if (!$workshop) {
            throw new \Exception('Workshop not found', 404);
        }

        $fleets = $workshop->fleets->map(function ($fleet) {
            return $this->populateFleetForResponse($fleet);
        });

        return $fleets;
    }
}
