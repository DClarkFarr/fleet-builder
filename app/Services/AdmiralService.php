<?php

namespace App\Services;

use App\Models\Admiral;
use App\Models\Admiral\Skill;
use App\Models\UserAdmiral;
use App\Models\User;
use Exception;

class AdmiralService
{

    public function createAdmiral(array $data)
    {
        $admiral = new Admiral;
        $admiral->name = $data['name'];
        $admiral->public = $data['public'];
        $admiral->save();

        return $admiral;
    }

    public function updateAdmiral(int $id_admiral, array $data)
    {
        $admiral = Admiral::find($id_admiral);
        if (!$admiral) {
            throw new Exception('Admiral not found', 404);
        }

        if ($data['name'] != $admiral->name && !$admiral->validateName($data['name'])) {
            throw new Exception('Name already exists', 400);
        }

        $admiral->name = $data['name'];
        $admiral->public = $data['public'];

        $admiral->save();

        return $admiral;
    }

    public function getAdmiral(int $id_admiral, $forResponse = false)
    {
        $admiral = Admiral::find($id_admiral);
        if (!$admiral) {
            throw new \Exception('Admiral not found', 404);
        }

        if ($forResponse) {
            return $this->populateAdmiralForResponse($admiral);
        }

        return $admiral;
    }

    public function getAdmirals($options = [])
    {
        $options = array_merge([
            'public' => true,
        ], $options);

        $query = Admiral::query();

        if ($options['public']) {
            $query->where('public', true);
        }

        $admirals = $query->get()
            ->map(function ($admiral) {
                return $this->populateAdmiralForResponse($admiral);
            })
            ->sort(function (Admiral $aa, Admiral $ab) {
                return $aa->name <=> $ab->name;
            })
            ->values();

        return $admirals;
    }

    public function populateAdmiralForResponse(Admiral $admiral)
    {
        $admiral->load(['skills']);

        return $admiral;
    }

    public function populateSkillForResponse(Skill $skill)
    {
        $skill->load(['abilities']);

        return $skill;
    }


    public function updateAdmiralSkills(int $id_admiral, string $location, array $abilities)
    {
        $admiral = Admiral::find($id_admiral);
        if (!$admiral) {
            throw new \Exception('Admiral not found', 404);
        }

        $currentAbilities = $admiral->abilities()->where('location', $location)->get();

        foreach ($abilities as $data) {
            if (!empty($data['id_ability'])) {
                $ability = $currentAbilities->where('id_ability', $data['id_ability'])->first();
                if ($ability) {
                    $ability->fill($data);
                    $ability->save();
                }
            } else {
                $ability = $admiral->abilities()->create(array_merge($data, ['location' => $location]));

                $currentAbilities->push($ability);
            }
        }

        return $currentAbilities;
    }

    public function deleteAdmiralAbility(int $id_admiral, int $id_ability)
    {
        $admiral = Admiral::find($id_admiral);
        if (!$admiral) {
            throw new \Exception('Admiral not found', 404);
        }

        $admiral->abilities()->where('id_ability', $id_ability)->delete();
    }

    /**
     * Get public user ships, sorted nicely by class and level
     *
     * @param [type] $id_user
     * @return Collection<UserAdmiral>
     */
    public function getUserAdmirals($id_user)
    {
        $admirals = UserAdmiral::where('id_user', $id_user)
            ->with('ship')
            ->whereHas('ship', function ($query) {
                $query->where('public', true);
            })
            ->get()
            ->map(function ($userAdmiral) {
                $userAdmiral->admiral = $this->populateAdmiralForResponse($userAdmiral->admiral);

                return $userAdmiral;
            })
            ->sort(function (UserAdmiral $aa, UserAdmiral $ab) {
                return $aa->admiral->name <=> $ab->admiral->name;
            })
            ->values();


        return $admirals;
    }

    public function createOrUpdateUserAdmiral(User $user, array $data)
    {
        $id_user_ship = $data['id_user_ship'] ?? null;
        unset($data['id_user_ship']);

        if ($id_user_ship) {
            $userAdmiral = UserAdmiral::find($id_user_ship);
            if (!$userAdmiral) {
                throw new \Exception('User Admiral not found', 404);
            }
        } else {
            $userAdmiral = new UserAdmiral();
            $userAdmiral->id_user = $user->id;
            $userAdmiral->visible = true;
        }

        $userAdmiral->fill($data);
        $userAdmiral->save();

        $userAdmiral->admiral = $this->populateAdmiralForResponse($userAdmiral->admiral);

        return $userAdmiral;
    }

    public function deleteUserAdmiral(User $user, $id_user_ship)
    {
        $admiral = $user->admirals()->find($id_user_ship);
        if (!$admiral) {
            throw new \Exception('Admiral not found', 404);
        }
        $admiral->delete();
    }

    public function deleteAllUserAdmirals(User $user)
    {
        $user->admirals()->delete();
    }

    public function createSkill($id_admiral, $location)
    {
        $admiral = $this->getAdmiral($id_admiral);

        $skill = $admiral->skills()->create([
            'location' => $location,
            'name' => 'Skill ' . explode('_', $location)[1],
        ]);

        return $this->populateSkillForResponse($skill);
    }
}
