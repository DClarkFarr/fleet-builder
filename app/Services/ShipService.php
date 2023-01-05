<?php

namespace App\Services;

use App\Models\Ship;
use App\Models\ShipClass;
use App\Models\ShipLevel;

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
}
